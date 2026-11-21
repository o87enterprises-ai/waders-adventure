import Phaser from 'phaser';
import { randomWord } from '../../storage/wordBank.js';
import { splitVowels } from '../../homework/parser.js';
import { addBackground, playMusic, sfx } from '../audio.js';
import { LEVELS, completeLevel, showIntro } from '../campaign.js';
import { clueFor, sentenceFor, speak, vowelReminder, VOWEL_KEYWORDS } from '../hints.js';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

export class FighterScene extends Phaser.Scene {
  constructor() { super('FighterScene'); }

  create(data) {
    const { width, height } = this.scale;
    this.levelIdx = data?.level ?? 0;
    const L = LEVELS[this.levelIdx];
    this.enemyName = L.enemy || 'DOOM';
    this.wadeHP = 3;
    this.doomHP = L.hp || 3;
    this.locked = false;
    this.recentWords = [];

    addBackground(this, 'bgArena', 0x1a0033);
    playMusic(this, 'music-arena');

    this.wade = this.add.image(width * 0.2, height * 0.62, 'wade').setScale(2);
    this.doom = this.add.image(width * 0.8, height * 0.62, 'doom').setScale(L.scale || 2).setFlipX(true);

    this.wadeHPText = this.add.text(30, 20, '', {
      fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#00ffff'
    });
    this.doomHPText = this.add.text(width - 30, 20, '', {
      fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#ff00ff'
    }).setOrigin(1, 0);

    // The arena background has neon signs painted on it; a dark panel keeps the hint text readable.
    this.add.rectangle(width / 2, 192, 780, 104, 0x000000, 0.6).setStrokeStyle(3, 0xffe066, 0.5);

    this.promptText = this.add.text(width / 2, 110, '', {
      fontFamily: '"Press Start 2P"', fontSize: '48px', color: '#ffff00',
      stroke: '#000', strokeThickness: 8
    }).setOrigin(0.5);

    this.clueText = this.add.text(width / 2, 165, '', {
      fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#ffffff',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);
    this.sentenceText = this.add.text(width / 2, 192, '', {
      fontFamily: '"Press Start 2P"', fontSize: '12px', color: '#ffe066',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);
    this.add.text(width / 2 + 330, 110, '🔊', { fontSize: '36px' }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => speak(this.currentWord));

    this.feedbackText = this.add.text(width / 2, 228, '', {
      fontFamily: '"Press Start 2P"', fontSize: '15px', color: '#fff'
    }).setOrigin(0.5);

    this.buildVowelButtons();
    this.input.keyboard.on('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (VOWELS.includes(k)) this.onVowel(k);
    });

    this.updateHP();

    const menuBtn = this.add.text(width / 2, 20, '⌂ MENU', {
      fontFamily: '"Press Start 2P"', fontSize: '12px', color: '#fff',
      backgroundColor: '#333366', padding: { x: 8, y: 6 }
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));

    this.nextRound();
    showIntro(this, this.levelIdx);
  }

  buildVowelButtons() {
    const { width, height } = this.scale;
    const btnY = height - 70;
    const spacing = 100;
    const startX = width / 2 - (spacing * (VOWELS.length - 1)) / 2;

    VOWELS.forEach((v, i) => {
      const x = startX + i * spacing;
      const img = this.add.image(x, btnY, 'vowelBtn')
        .setInteractive({ useHandCursor: true })
        .setScale(0.9);
      const label = this.add.text(x, btnY, v.toUpperCase(), {
        fontFamily: '"Press Start 2P"', fontSize: '32px', color: '#000'
      }).setOrigin(0.5);
      this.add.text(x, btnY + 46, VOWEL_KEYWORDS[v], {
        fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#ffe066',
        stroke: '#000', strokeThickness: 3
      }).setOrigin(0.5);
      img.on('pointerdown', () => this.onVowel(v));
      // subtle bounce
      this.tweens.add({ targets: img, scale: 0.95, duration: 500, yoyo: true, repeat: -1 });
    });
  }

  nextRound() {
    this.locked = false;
    this.feedbackText.setText('');
    const word = randomWord(this.recentWords);
    this.recentWords.push(word);
    if (this.recentWords.length > 6) this.recentWords.shift();

    const parts = splitVowels(word);
    this.currentWord = word;
    this.currentVowel = parts.vowel;
    this.promptText.setText(
      `${parts.consonantStart.toUpperCase()}  _  ${parts.consonantEnd.toUpperCase()}`
    );
    this.clueText.setText(clueFor(word));
    this.sentenceText.setText(sentenceFor(word));
    speak(word);
  }

  onVowel(v) {
    if (this.locked) return;
    this.locked = true;
    if (v === this.currentVowel) this.onCorrect();
    else this.onWrong(v);
  }

  onCorrect() {
    this.feedbackText.setText(`YES!  ${this.currentWord.toUpperCase()}`).setColor('#00ff66');
    this.tweens.add({
      targets: this.wade,
      x: this.wade.x + 200,
      duration: 220,
      yoyo: true,
      ease: 'Power2',
      onYoyo: () => {
        sfx(this, 'sfx-punch');
        sfx(this, 'sfx-correct', 0.5);
        this.doomHP = Math.max(0, this.doomHP - 1);
        this.updateHP();
        this.cameras.main.shake(160, 0.012);
        this.doom.setTint(0xff0000);
        this.time.delayedCall(220, () => this.doom.clearTint());
      },
      onComplete: () => this.checkWin()
    });
  }

  onWrong(picked) {
    this.feedbackText.setText(`Not ${picked.toUpperCase()}! ${vowelReminder(this.currentWord, this.currentVowel)}`)
      .setColor('#ff6666');
    this.time.delayedCall(350, () => speak(this.currentWord));
    this.tweens.add({
      targets: this.doom,
      x: this.doom.x - 200,
      duration: 220,
      yoyo: true,
      ease: 'Power2',
      onYoyo: () => {
        sfx(this, 'sfx-punch');
        sfx(this, 'sfx-wrong', 0.5);
        this.wadeHP = Math.max(0, this.wadeHP - 1);
        this.updateHP();
        this.cameras.main.shake(160, 0.012);
        this.wade.setTint(0xff0000);
        this.time.delayedCall(220, () => this.wade.clearTint());
      },
      onComplete: () => this.checkWin()
    });
  }

  updateHP() {
    this.wadeHPText.setText('WADE ' + '♥'.repeat(this.wadeHP));
    this.doomHPText.setText('♥'.repeat(this.doomHP) + ' ' + this.enemyName);
  }

  checkWin() {
    if (this.doomHP <= 0) completeLevel(this, this.levelIdx, 50 + this.wadeHP * 10);
    else if (this.wadeHP <= 0) this.endGame('OUCH! TRY AGAIN', '#ff1744');
    else this.time.delayedCall(700, () => this.nextRound());
  }

  endGame(msg, color) {
    const { width, height } = this.scale;
    this.sound.stopAll();
    sfx(this, 'sfx-lose');
    this.add.rectangle(0, 0, width, height, 0x000000, 0.75).setOrigin(0);
    this.add.text(width / 2, height / 2 - 40, msg, {
      fontFamily: '"Press Start 2P"', fontSize: '42px', color,
      stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 50, 'Tap to retry this level', {
      fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#fff'
    }).setOrigin(0.5);
    const retry = () => this.scene.restart({ level: this.levelIdx });
    this.time.delayedCall(500, () => {
      this.input.once('pointerdown', retry);
      this.input.keyboard.once('keydown', retry);
    });
  }
}
