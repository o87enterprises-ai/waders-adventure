import Phaser from 'phaser';
import { randomWord } from '../../storage/wordBank.js';
import { splitVowels } from '../../homework/parser.js';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

export class FighterScene extends Phaser.Scene {
  constructor() { super('FighterScene'); }

  create() {
    const { width, height } = this.scale;
    this.wadeHP = 3;
    this.doomHP = 3;
    this.locked = false;
    this.recentWords = [];

    this.add.rectangle(0, 0, width, height, 0x1a0033).setOrigin(0);

    this.wade = this.add.image(width * 0.2, height * 0.62, 'wade').setScale(2);
    this.doom = this.add.image(width * 0.8, height * 0.62, 'doom').setScale(2).setFlipX(true);

    this.wadeHPText = this.add.text(30, 20, '', {
      fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#00ffff'
    });
    this.doomHPText = this.add.text(width - 30, 20, '', {
      fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#ff00ff'
    }).setOrigin(1, 0);

    this.promptText = this.add.text(width / 2, 110, '', {
      fontFamily: '"Press Start 2P"', fontSize: '48px', color: '#ffff00',
      stroke: '#000', strokeThickness: 8
    }).setOrigin(0.5);

    this.feedbackText = this.add.text(width / 2, 190, '', {
      fontFamily: '"Press Start 2P"', fontSize: '18px', color: '#fff'
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
    this.feedbackText.setText(`Not "${picked}" — try "${this.currentVowel}"!`).setColor('#ff6666');
    this.tweens.add({
      targets: this.doom,
      x: this.doom.x - 200,
      duration: 220,
      yoyo: true,
      ease: 'Power2',
      onYoyo: () => {
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
    this.doomHPText.setText('♥'.repeat(this.doomHP) + ' DOOM');
  }

  checkWin() {
    if (this.doomHP <= 0) this.endGame('YOU WIN!', '#00ff66');
    else if (this.wadeHP <= 0) this.endGame('DOOM WINS…', '#ff1744');
    else this.time.delayedCall(700, () => this.nextRound());
  }

  endGame(msg, color) {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.75).setOrigin(0);
    this.add.text(width / 2, height / 2 - 40, msg, {
      fontFamily: '"Press Start 2P"', fontSize: '42px', color,
      stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 50, 'Tap to return to menu', {
      fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#fff'
    }).setOrigin(0.5);
    const back = () => this.scene.start('MenuScene');
    this.input.once('pointerdown', back);
    this.input.keyboard.once('keydown', back);
  }
}
