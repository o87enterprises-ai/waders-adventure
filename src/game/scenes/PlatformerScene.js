import Phaser from 'phaser';
import { randomWord } from '../../storage/wordBank.js';
import { splitVowels } from '../../homework/parser.js';
import { addBackground, playMusic, sfx } from '../audio.js';
import { LEVELS, completeLevel, showIntro } from '../campaign.js';
import { clueFor, sentenceFor, speak, vowelReminder, VOWEL_KEYWORDS } from '../hints.js';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];
const FONT = '"Press Start 2P"';
const SPEED = 240;
const JUMP = -640;
const GROUND_TOP = 480;

// Mario-style level: run, jump, bump "?" blocks from below to answer the vowel,
// solve them all to raise the goal flag, then touch the flag.
export class PlatformerScene extends Phaser.Scene {
  constructor() { super('PlatformerScene'); }

  create(data) {
    this.levelIdx = data?.level ?? 0;
    const L = LEVELS[this.levelIdx];
    const H = this.scale.height;
    const SW = this.scale.width;
    this.worldW = SW * L.screens;
    this.totalBlocks = L.blocks;
    this.solved = 0;
    this.levelScore = 0;
    this.promptActive = false;
    this.done = false;
    this.touch = { left: false, right: false, jump: false };

    for (let i = 0; i < L.screens; i++) {
      addBackground(this, 'bgPlatform', 0x331166).setPosition(i * SW, 0);
    }
    playMusic(this, 'music-platform');

    this.physics.world.setBounds(0, 0, this.worldW, H);
    this.physics.world.setBoundsCollision(true, true, true, false); // open bottom: pits
    this.cameras.main.setBounds(0, 0, this.worldW, H);
    this.hp = 3;
    this.invuln = false;
    this.stunUntil = 0;
    this.safeX = 80;

    this.plan = this.planLayout(L);
    this.buildGround();

    // Cloud platforms to hop across
    this.clouds = this.physics.add.staticGroup();
    for (let x = 520; x < this.worldW - 300; x += 640) {
      const c = this.clouds.create(x, 372 - (x % 3) * 12, 'cloud');
      c.body.checkCollision.down = false;
      c.body.checkCollision.left = false;
      c.body.checkCollision.right = false;
      c.body.setSize(170, 14).setOffset(15, 22);
    }

    this.wade = this.physics.add.sprite(80, GROUND_TOP - 100, 'wade');
    this.wade.setCollideWorldBounds(true);
    this.wade.body.setSize(34, 86).setOffset(15, 10);
    this.physics.add.collider(this.wade, this.ground);
    this.physics.add.collider(this.wade, this.clouds);
    this.cameras.main.startFollow(this.wade, true, 0.12, 0.12);

    this.buildBlocks();
    this.buildHazards();
    this.buildHearts();

    this.scoreText = this.add.text(16, 14, '', {
      fontFamily: FONT, fontSize: '14px', color: '#fff', stroke: '#000', strokeThickness: 4
    }).setScrollFactor(0).setDepth(50);
    this.hintText = this.add.text(SW / 2, 56, 'BUMP ? BLOCKS FROM BELOW · STOMP THE BOTS!', {
      fontFamily: FONT, fontSize: '11px', color: '#ffff00', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50);
    this.updateHUD();

    const menuBtn = this.add.text(SW - 16, 14, '⌂ MENU', {
      fontFamily: FONT, fontSize: '12px', color: '#fff',
      backgroundColor: '#221144', padding: { x: 8, y: 6 }
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(50).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));

    this.keys = this.input.keyboard.addKeys({
      left: 'LEFT', right: 'RIGHT', up: 'UP', space: 'SPACE', a: 'A', d: 'D', w: 'W'
    });

    this.input.addPointer(2);
    const mk = (x, label, on, off) => {
      const b = this.add.text(x, H - 60, label, {
        fontFamily: FONT, fontSize: '26px', color: '#fff',
        backgroundColor: '#444a88cc', padding: { x: 14, y: 14 }
      }).setOrigin(0.5).setScrollFactor(0).setDepth(50).setInteractive();
      b.on('pointerdown', on);
      if (off) { b.on('pointerup', off); b.on('pointerout', off); }
    };
    mk(70, '◀', () => (this.touch.left = true), () => (this.touch.left = false));
    mk(180, '▶', () => (this.touch.right = true), () => (this.touch.right = false));
    mk(SW - 80, '▲', () => (this.touch.jump = true));

    showIntro(this, this.levelIdx);
  }

  blockX(i) {
    const n = this.totalBlocks;
    const span = this.worldW - 900;
    return 420 + (n === 1 ? span / 2 : (span * i) / (n - 1));
  }

  // Decide where pits and hazards go: deterministic per level, away from blocks.
  planLayout(L) {
    const blockXs = Array.from({ length: this.totalBlocks }, (_, i) => this.blockX(i));
    const slots = [];
    for (let x = 640; x < this.worldW - 340; x += 170) {
      if (blockXs.every((bx) => Math.abs(bx - x) > 150)) slots.push(x);
    }
    const rng = new Phaser.Math.RandomDataGenerator([`waders-${this.levelIdx}`]);
    rng.shuffle(slots);
    const take = (n) => slots.splice(0, n || 0);
    return {
      pits: take(L.pits).sort((a, b) => a - b),
      spikes: take(L.spikes),
      bots: take(L.bots),
      drones: take(L.drones)
    };
  }

  buildGround() {
    const H = this.scale.height;
    const HALF = 60; // half pit width
    this.ground = this.physics.add.staticGroup();
    let start = 0;
    const seg = (a, b) => {
      const r = this.add.rectangle((a + b) / 2, H - 30, b - a, 60).setVisible(false);
      this.ground.add(r);
    };
    for (const px of this.plan.pits) {
      seg(start, px - HALF);
      start = px + HALF;
      // dark hole cut into the street
      this.add.rectangle(px, H - 60, HALF * 2, 120, 0x0a0014).setDepth(3);
      this.add.rectangle(px, H - 118, HALF * 2, 4, 0x4a3a66).setDepth(3);
    }
    seg(start, this.worldW);
  }

  buildHazards() {
    const H = this.scale.height;
    this.enemies = this.physics.add.group({ allowGravity: false });

    for (const x of this.plan.spikes) {
      const s = this.physics.add.staticImage(x, GROUND_TOP - 12, 'spikes').setDepth(4);
      s.body.setSize(36, 16).setOffset(6, 8);
      this.physics.add.overlap(this.wade, s, () => this.hurt(s.x));
    }

    for (const x of this.plan.bots) {
      const e = this.physics.add.sprite(x, GROUND_TOP - 30, 'bot').setDepth(4);
      e.body.setSize(34, 36).setOffset(7, 10);
      e.body.setAllowGravity(true);
      e.play('bot-move');
      e.kind = 'bot';
      e.home = x;
      e.dir = -1;
      this.enemies.add(e);
      e.body.setAllowGravity(true);
      this.physics.add.collider(e, this.ground);
    }

    this.plan.drones.forEach((x, i) => {
      const e = this.physics.add.sprite(x, 395, 'drone').setDepth(4);
      e.body.setAllowGravity(false);
      e.body.setSize(34, 30).setOffset(7, 9);
      e.play('drone-move');
      e.kind = 'drone';
      this.enemies.add(e);
      e.body.setAllowGravity(false);
      this.tweens.add({ targets: e, x: x + 130, duration: 1700 + i * 300, yoyo: true, repeat: -1, ease: 'Sine.inOut',
        onYoyo: () => e.setFlipX(true), onRepeat: () => e.setFlipX(false) });
      this.tweens.add({ targets: e, y: 355, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    });

    this.physics.add.overlap(this.wade, this.enemies, (_w, e) => this.touchEnemy(e));
  }

  buildHearts() {
    this.heartImgs = [];
    for (let i = 0; i < 3; i++) {
      this.heartImgs.push(this.add.image(32 + i * 38, 54, 'heart').setScrollFactor(0).setDepth(50));
    }
  }

  touchEnemy(e) {
    if (e.dead || this.done) return;
    const stomp = this.wade.body.velocity.y > 60 && this.wade.body.bottom <= e.body.top + 24;
    if (stomp) {
      e.dead = true;
      e.body.enable = false;
      sfx(this, 'sfx-punch');
      this.wade.setVelocityY(-430);
      this.levelScore += 5;
      this.updateHUD();
      this.tweens.add({ targets: e, scaleY: 0.2, alpha: 0, duration: 250, onComplete: () => e.destroy() });
    } else {
      this.hurt(e.x);
    }
  }

  hurt(srcX) {
    if (this.invuln || this.done || this.promptActive) return;
    this.hp--;
    this.heartImgs.forEach((h, i) => h.setAlpha(i < this.hp ? 1 : 0.2));
    sfx(this, 'sfx-wrong');
    this.cameras.main.shake(150, 0.008);
    if (this.hp <= 0) return this.gameOver();
    this.invuln = true;
    this.stunUntil = this.time.now + 300;
    this.wade.setVelocity(srcX < this.wade.x ? 280 : -280, -360);
    this.tweens.add({
      targets: this.wade, alpha: 0.3, duration: 100, yoyo: true, repeat: 6,
      onComplete: () => { this.wade.setAlpha(1); this.invuln = false; }
    });
  }

  fellInPit() {
    this.hp--;
    this.heartImgs.forEach((h, i) => h.setAlpha(i < this.hp ? 1 : 0.2));
    sfx(this, 'sfx-wrong');
    if (this.hp <= 0) return this.gameOver();
    this.wade.setPosition(this.safeX, 300).setVelocity(0, 0);
    this.invuln = true;
    this.time.delayedCall(1200, () => (this.invuln = false));
  }

  gameOver() {
    this.done = true;
    this.physics.pause();
    this.sound.stopAll();
    sfx(this, 'sfx-lose');
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x000000, 0.75).setOrigin(0).setScrollFactor(0).setDepth(300);
    this.add.text(width / 2, height / 2 - 30, 'OUCH! TRY AGAIN', {
      fontFamily: FONT, fontSize: '34px', color: '#ff1744', stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(301);
    this.add.text(width / 2, height / 2 + 40, 'Tap to retry this level', {
      fontFamily: FONT, fontSize: '14px', color: '#fff'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(301);
    const retry = () => this.scene.restart({ level: this.levelIdx });
    this.time.delayedCall(600, () => {
      this.input.once('pointerdown', retry);
      this.input.keyboard.once('keydown', retry);
    });
  }

  buildBlocks() {
    const n = this.totalBlocks;
    this.blocks = [];
    const used = [];
    for (let i = 0; i < n; i++) {
      const x = this.blockX(i);
      const bottom = i % 2 ? 300 : 330; // both reachable with a jump
      const y = bottom - 25;
      const word = randomWord(used);
      used.push(word);
      const parts = splitVowels(word);

      const img = this.physics.add.staticImage(x, y, 'wordBlock').setScale(0.6).refreshBody();
      img.setDepth(5);
      const label = this.add.text(x, y, `${parts.consonantStart.toUpperCase()}_${parts.consonantEnd.toUpperCase()}`, {
        fontFamily: FONT, fontSize: '16px', color: '#fff'
      }).setOrigin(0.5).setDepth(6);
      img.word = word;
      img.vowel = parts.vowel;
      img.label = label;
      img.solved = false;
      img.lockUntil = 0;
      this.blocks.push(img);
      this.physics.add.collider(this.wade, img, () => this.onBump(img));
    }
  }

  onBump(block) {
    if (block.solved || this.promptActive || this.time.now < block.lockUntil) return;
    if (this.wade.body.touching.up) this.openVowelPrompt(block);
  }

  updateHUD() {
    this.scoreText.setText(`BLOCKS ${this.solved}/${this.totalBlocks}   SCORE ${this.levelScore}`);
  }

  update() {
    if (this.promptActive || this.done) return;

    // bot patrol
    for (const e of this.enemies.getChildren()) {
      if (e.kind !== 'bot' || e.dead) continue;
      if (e.x < e.home - 70) e.dir = 1;
      else if (e.x > e.home + 70) e.dir = -1;
      e.setVelocityX(e.dir * 70);
      e.setFlipX(e.dir > 0);
    }

    if (this.wade.y > this.scale.height + 30) return this.fellInPit();
    const onFloor = this.wade.body.blocked.down || this.wade.body.touching.down;
    if (onFloor && this.plan.pits.every((p) => Math.abs(p - this.wade.x) > 110)) this.safeX = this.wade.x;
    if (this.time.now < this.stunUntil) return;

    const k = this.keys;
    const left = k.left.isDown || k.a.isDown || this.touch.left;
    const right = k.right.isDown || k.d.isDown || this.touch.right;
    const jumpKey = Phaser.Input.Keyboard.JustDown(k.up) || Phaser.Input.Keyboard.JustDown(k.space) ||
      Phaser.Input.Keyboard.JustDown(k.w);
    const jump = jumpKey || this.touch.jump;
    this.touch.jump = false;

    const dir = (right ? 1 : 0) - (left ? 1 : 0);
    this.wade.setVelocityX(dir * SPEED);
    if (dir) this.wade.setFlipX(dir < 0);
    const grounded = this.wade.body.blocked.down || this.wade.body.touching.down;
    if (jump && grounded) this.wade.setVelocityY(JUMP);
  }

  openVowelPrompt(block) {
    this.promptActive = true;
    this.physics.pause();
    const { width, height } = this.scale;
    const D = 100;

    const overlay = this.add.rectangle(width / 2, height / 2, width, 280, 0x000000, 0.88)
      .setScrollFactor(0).setDepth(D);
    const p = splitVowels(block.word);
    const title = this.add.text(width / 2, height / 2 - 92,
      `${p.consonantStart.toUpperCase()}  _  ${p.consonantEnd.toUpperCase()}`, {
        fontFamily: FONT, fontSize: '40px', color: '#ffff00', stroke: '#000', strokeThickness: 6
      }).setOrigin(0.5).setScrollFactor(0).setDepth(D + 1);
    const clue = clueFor(block.word);
    const sub = this.add.text(width / 2, height / 2 - 52, clue || 'PICK THE VOWEL', {
      fontFamily: FONT, fontSize: '13px', color: '#fff', align: 'center', wordWrap: { width: width - 80 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(D + 1);
    const sentence = this.add.text(width / 2, height / 2 - 24, sentenceFor(block.word), {
      fontFamily: FONT, fontSize: '12px', color: '#ffe066', align: 'center', wordWrap: { width: width - 80 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(D + 1);
    const hear = this.add.text(width / 2, height / 2 + 8, '🔊 HEAR IT', {
      fontFamily: FONT, fontSize: '12px', color: '#fff',
      backgroundColor: '#2266cc', padding: { x: 10, y: 6 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(D + 1).setInteractive({ useHandCursor: true });
    hear.on('pointerdown', () => speak(block.word));
    speak(block.word);

    const keywords = [];
    const buttons = VOWELS.map((v, i) => {
      const bx = width / 2 + (i - 2) * 100;
      const kw = this.add.text(bx, height / 2 + 104, VOWEL_KEYWORDS[v], {
        fontFamily: FONT, fontSize: '9px', color: '#ffe066'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(D + 1);
      keywords.push(kw);
      const b = this.add.text(bx, height / 2 + 62, v.toUpperCase(), {
        fontFamily: FONT, fontSize: '28px', color: '#000',
        backgroundColor: '#ffcc00', padding: { x: 16, y: 16 }
      }).setOrigin(0.5).setScrollFactor(0).setDepth(D + 1).setInteractive({ useHandCursor: true });
      b.on('pointerdown', () => finish(v));
      return b;
    });

    const ui = [overlay, title, sub, sentence, hear, ...buttons, ...keywords];
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if (VOWELS.includes(key)) finish(key);
    };
    const finish = (picked) => {
      this.input.keyboard.off('keydown', onKey);
      ui.forEach((el) => el.destroy());
      this.promptActive = false;
      this.physics.resume();
      if (picked === block.vowel) this.solveBlock(block);
      else {
        sfx(this, 'sfx-wrong');
        this.time.delayedCall(350, () => speak(block.word)); // replay the word + sentence as a second hint
        const normalHint = 'BUMP ? BLOCKS FROM BELOW · STOMP THE BOTS!';
        this.hintText.setText(`NOT ${picked.toUpperCase()}! ${vowelReminder(block.word, block.vowel)}`);
        this.time.delayedCall(4000, () => { if (!this.done && this.hintText.text.startsWith('NOT ')) this.hintText.setText(normalHint); });
        this.cameras.main.shake(200, 0.01);
        block.lockUntil = this.time.now + 700;
        this.wade.setVelocityY(0);
      }
    };
    // Delay key listener one tick so the jump key can't answer instantly.
    this.time.delayedCall(150, () => { if (this.promptActive) this.input.keyboard.on('keydown', onKey); });
  }

  solveBlock(block) {
    block.solved = true;
    block.setTint(0x66ff88);
    block.label.setText(block.word.toUpperCase()).setColor('#003311');
    sfx(this, 'sfx-coin');
    sfx(this, 'sfx-correct', 0.4);
    this.tweens.add({ targets: [block, block.label], y: '-=12', duration: 100, yoyo: true });
    this.solved++;
    this.levelScore += 10;
    this.updateHUD();
    if (this.solved >= this.totalBlocks) this.raiseFlag();
  }

  raiseFlag() {
    const x = this.worldW - 90;
    this.hintText.setText('GREAT! RUN TO THE FLAG!');
    this.add.rectangle(x, GROUND_TOP - 80, 6, 160, 0xffffff).setDepth(4);
    const flag = this.add.triangle(x + 3, GROUND_TOP - 140, 0, 0, 0, 40, 46, 20, 0xff2d55).setOrigin(0, 0).setDepth(4);
    flag.y = GROUND_TOP - 160;
    this.tweens.add({ targets: flag, scaleX: 0.8, duration: 300, yoyo: true, repeat: -1 });
    const zone = this.add.zone(x, GROUND_TOP - 80, 50, 170);
    this.physics.add.existing(zone, true);
    this.physics.add.overlap(this.wade, zone, () => {
      if (this.done) return;
      this.done = true;
      this.wade.setVelocity(0, 0);
      this.levelScore += 20;
      completeLevel(this, this.levelIdx, this.levelScore);
    });
  }
}
