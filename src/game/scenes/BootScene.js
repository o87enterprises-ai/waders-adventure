import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  preload() {
    // Attempt to load real assets; if missing, we fall back to placeholders.
    this.load.image('wade', 'assets/wade.png');
    this.load.image('doom', 'assets/doom.png');
    this.load.image('spidey', 'assets/spidey.png');
    this.load.image('vowelBtn', 'assets/btn-vowel.png');
    this.load.image('wordBlock', 'assets/word-block.png');
    this.load.image('heart', 'assets/heart-icon.png');
    this.load.image('scoreBadge', 'assets/score-badge.png');
    this.load.image('cloud', 'assets/cloud-platform.png');
    this.load.image('bgMenu', 'assets/bg-menu.png');
    this.load.image('bgArena', 'assets/bg-arena.png');
    this.load.image('bgPlatform', 'assets/bg-platform.png');
    this.load.image('bgMini', 'assets/bg-mini.png');
    this.load.spritesheet('bot', 'assets/bot-sheet.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('drone', 'assets/drone-sheet.png', { frameWidth: 48, frameHeight: 48 });
    this.load.image('spikes', 'assets/spikes.png');
    this.load.image('title', 'assets/title-screen.png');
    this.load.image('spideyCameo', 'assets/spidey-cameo.png');
    for (const k of ['music-menu', 'music-arena', 'music-platform', 'sfx-punch', 'sfx-correct',
      'sfx-wrong', 'sfx-coin', 'sfx-win', 'sfx-lose']) {
      this.load.audio(k, `audio/${k}.wav`);
    }
    this.load.on('loaderror', (f) => console.warn('Missing asset, will use placeholder:', f.key));
  }

  create() {
    this.makePlaceholders();
    for (const k of ['bot', 'drone']) {
      if (this.textures.exists(k) && !this.anims.exists(`${k}-move`)) {
        this.anims.create({ key: `${k}-move`, frames: this.anims.generateFrameNumbers(k, { start: 0, end: 1 }), frameRate: k === 'bot' ? 5 : 12, repeat: -1 });
      }
    }
    this.scene.start('MenuScene');
  }

  makePlaceholders() {
    if (!this.textures.exists('wade')) this.drawHero('wade', 0x1e88e5, 0xffcc99, 0xffffff);
    if (!this.textures.exists('doom')) this.drawHero('doom', 0x2e7d32, 0xb0bec5, 0x4a148c);
    if (!this.textures.exists('spidey')) this.drawHero('spidey', 0xd32f2f, 0xff1744, 0xffffff);
    if (!this.textures.exists('vowelBtn')) this.drawVowelBtn();
    if (!this.textures.exists('wordBlock')) this.drawWordBlock();
  }

  drawHero(key, bodyColor, headColor, accentColor) {
    const g = this.make.graphics({ add: false });
    g.fillStyle(bodyColor, 1);
    g.fillRect(10, 32, 44, 48); // torso
    g.fillRect(2, 36, 10, 32); // left arm
    g.fillRect(52, 36, 10, 32); // right arm
    g.fillRect(14, 80, 14, 8); // left leg
    g.fillRect(36, 80, 14, 8); // right leg
    g.fillStyle(headColor, 1);
    g.fillRect(18, 6, 28, 28); // head
    g.fillStyle(accentColor, 1);
    g.fillRect(22, 16, 6, 6); // eye L
    g.fillRect(36, 16, 6, 6); // eye R
    g.fillRect(24, 26, 16, 2); // mouth
    g.generateTexture(key, 64, 96);
    g.destroy();
  }

  drawVowelBtn() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0xffcc00, 1);
    g.fillRect(0, 0, 80, 80);
    g.lineStyle(4, 0x000000, 1);
    g.strokeRect(2, 2, 76, 76);
    g.generateTexture('vowelBtn', 80, 80);
    g.destroy();
  }

  drawWordBlock() {
    const g = this.make.graphics({ add: false });
    g.fillStyle(0x9c27b0, 1);
    g.fillRect(0, 0, 160, 90);
    g.lineStyle(5, 0xffffff, 1);
    g.strokeRect(3, 3, 154, 84);
    g.generateTexture('wordBlock', 160, 90);
    g.destroy();
  }
}
