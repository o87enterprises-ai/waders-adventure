import Phaser from 'phaser';
import { getWordBank } from '../../storage/wordBank.js';
import { addBackground, playMusic, sfx } from '../audio.js';
import { LEVELS, completeLevel, showIntro } from '../campaign.js';

const FONT = '"Press Start 2P"';

// Sort falling words into the matching rhyme-family basket (-AT, -UN ...).
export class MiniMissionScene extends Phaser.Scene {
  constructor() { super('MiniMissionScene'); }

  create(data) {
    this.levelIdx = data?.level ?? 0;
    this.goal = LEVELS[this.levelIdx].goal;
    const { width, height } = this.scale;
    this.sorted = 0;
    this.done = false;
    this.active = new Set();

    addBackground(this, 'bgMini', 0x003322);
    playMusic(this, 'music-menu', 0.3);

    this.add.text(width / 2, 40, 'DRAG EACH WORD TO ITS FAMILY', {
      fontFamily: FONT, fontSize: '16px', color: '#ffff00', stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5);

    // Pick the two biggest rhyme families from the word bank.
    const families = {};
    for (const w of getWordBank()) {
      const fam = w.slice(-2);
      families[fam] = (families[fam] || 0) + 1;
    }
    this.families = Object.keys(families).sort((a, b) => families[b] - families[a]).slice(0, 2);

    this.baskets = {};
    this.families.forEach((fam, i) => {
      const bx = width * (0.3 + i * 0.4);
      const by = height - 90;
      this.add.rectangle(bx, by, 240, 130, 0x005533, 0.92).setStrokeStyle(4, 0xffffff);
      this.add.text(bx, by, `-${fam.toUpperCase()}`, {
        fontFamily: FONT, fontSize: '30px', color: '#fff'
      }).setOrigin(0.5);
      this.baskets[fam] = { x: bx, y: by };
    });

    this.scoreText = this.add.text(16, 14, '', {
      fontFamily: FONT, fontSize: '14px', color: '#fff', stroke: '#000', strokeThickness: 4
    });
    this.updateHUD();

    const menuBtn = this.add.text(width - 16, 14, '⌂ MENU', {
      fontFamily: FONT, fontSize: '12px', color: '#fff',
      backgroundColor: '#004422', padding: { x: 8, y: 6 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));

    this.time.addEvent({ delay: 1900, loop: true, callback: () => this.spawnWord() });
    this.spawnWord();
    showIntro(this, this.levelIdx);
  }

  updateHUD() {
    this.scoreText.setText(`SORTED ${this.sorted}/${this.goal}`);
  }

  spawnWord() {
    if (this.done || this.active.size >= 3) return;
    const shown = [...this.active].map((l) => l.word);
    const pool = getWordBank().filter((w) => this.families.includes(w.slice(-2)) && !shown.includes(w));
    if (!pool.length) return;
    const word = pool[Math.floor(Math.random() * pool.length)];
    const x = Phaser.Math.Between(140, this.scale.width - 140);
    const label = this.add.text(x, 90, word.toUpperCase(), {
      fontFamily: FONT, fontSize: '26px', color: '#ff2d55',
      backgroundColor: '#ffffff', padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setInteractive({ draggable: true, useHandCursor: true });
    label.word = word;
    this.active.add(label);
    this.input.setDraggable(label);
    this.startFall(label);

    label.on('dragstart', () => label.fall && label.fall.stop());
    label.on('drag', (_p, dx, dy) => { label.x = dx; label.y = dy; });
    label.on('dragend', () => this.dropWord(label));
  }

  startFall(label) {
    label.fall = this.tweens.add({
      targets: label, y: this.scale.height - 200, duration: 11000 - (label.y - 90) * 10,
      onComplete: () => this.respawn(label)
    });
  }

  respawn(label) {
    if (this.done || !label.active) return;
    label.fall && label.fall.stop();
    this.tweens.add({
      targets: label, x: Phaser.Math.Between(140, this.scale.width - 140), y: 90, duration: 350,
      onComplete: () => label.active && this.startFall(label)
    });
  }

  dropWord(label) {
    const hit = Object.entries(this.baskets).find(
      ([, b]) => Phaser.Math.Distance.Between(label.x, label.y, b.x, b.y) < 130
    );
    if (!hit) return this.respawn(label);
    if (hit[0] !== label.word.slice(-2)) {
      sfx(this, 'sfx-wrong');
      this.cameras.main.shake(150, 0.006);
      return this.respawn(label);
    }
    sfx(this, 'sfx-coin');
    label.disableInteractive();
    this.active.delete(label);
    this.sorted++;
    this.updateHUD();
    this.tweens.add({ targets: label, alpha: 0, scale: 0.3, duration: 300, onComplete: () => label.destroy() });
    if (this.sorted >= this.goal && !this.done) {
      this.done = true;
      this.active.forEach((l) => l.destroy());
      completeLevel(this, this.levelIdx, this.goal * 5);
    }
  }
}
