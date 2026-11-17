import Phaser from 'phaser';
import { getWordBank } from '../../storage/wordBank.js';

export class MiniMissionScene extends Phaser.Scene {
  constructor() { super('MiniMissionScene'); }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x003322).setOrigin(0);

    this.add.text(width / 2, 40, 'SORT THE WORDS', {
      fontFamily: '"Press Start 2P"', fontSize: '24px', color: '#ffff00'
    }).setOrigin(0.5);

    const bank = getWordBank();
    const families = {};
    for (const w of bank) {
      const fam = w.slice(-2);
      families[fam] = (families[fam] || 0) + 1;
    }
    const top = Object.keys(families)
      .sort((a, b) => families[b] - families[a])
      .slice(0, 2);

    if (top.length < 2) {
      this.add.text(width / 2, height / 2, 'Need more words!\nScan more homework.', {
        fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#fff', align: 'center'
      }).setOrigin(0.5);
      this.input.once('pointerdown', () => this.scene.start('MenuScene'));
      return;
    }

    this.families = top;
    this.baskets = {};
    top.forEach((fam, i) => {
      const bx = width * (0.3 + i * 0.4);
      const by = height - 110;
      this.add.rectangle(bx, by, 240, 160, 0x005533).setStrokeStyle(4, 0xffffff);
      this.add.text(bx, by, `-${fam.toUpperCase()}`, {
        fontFamily: '"Press Start 2P"', fontSize: '30px', color: '#fff'
      }).setOrigin(0.5);
      this.baskets[fam] = { x: bx, y: by };
    });

    this.score = 0;
    this.scoreText = this.add.text(20, 20, 'SCORE  0', {
      fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#fff'
    });

    const menuBtn = this.add.text(width - 20, 20, '⌂ MENU', {
      fontFamily: '"Press Start 2P"', fontSize: '12px', color: '#fff',
      backgroundColor: '#004422', padding: { x: 8, y: 6 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));

    this.time.addEvent({
      delay: 1800, loop: true, callback: () => this.spawnWord()
    });
    this.spawnWord();
  }

  spawnWord() {
    const bank = getWordBank().filter((w) => this.families.includes(w.slice(-2)));
    if (!bank.length) return;
    const word = bank[Math.floor(Math.random() * bank.length)];
    const x = Phaser.Math.Between(120, this.scale.width - 120);
    const label = this.add.text(x, 90, word.toUpperCase(), {
      fontFamily: '"Press Start 2P"', fontSize: '26px', color: '#ff2d55',
      backgroundColor: '#fff', padding: { x: 12, y: 6 }
    }).setOrigin(0.5).setInteractive({ draggable: true, useHandCursor: true });

    this.input.setDraggable(label);

    label.on('drag', (_p, dx, dy) => {
      label.x = dx;
      label.y = dy;
    });

    label.on('dragend', () => {
      const fam = word.slice(-2);
      const b = this.baskets[fam];
      if (b && Phaser.Math.Distance.Between(label.x, label.y, b.x, b.y) < 140) {
        this.score += 5;
        this.scoreText.setText('SCORE  ' + this.score);
        this.tweens.add({
          targets: label, alpha: 0, scale: 0.3, duration: 300,
          onComplete: () => label.destroy()
        });
      }
    });
  }
}
