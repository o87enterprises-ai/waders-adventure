import Phaser from 'phaser';
import { randomWord } from '../../storage/wordBank.js';
import { splitVowels } from '../../homework/parser.js';

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

export class PlatformerScene extends Phaser.Scene {
  constructor() { super('PlatformerScene'); }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(0, 0, width, height, 0x331166).setOrigin(0);

    // Ground
    const ground = this.add.rectangle(width / 2, height - 30, width, 60, 0x553388);
    this.physics.add.existing(ground, true);

    this.wade = this.physics.add.sprite(100, height - 180, 'wade');
    this.wade.setCollideWorldBounds(true);
    this.physics.add.collider(this.wade, ground);

    this.score = 0;
    this.scoreText = this.add.text(20, 20, 'SCORE  0', {
      fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#fff'
    });

    this.hintText = this.add.text(width / 2, 40, 'JUMP (▲) NEAR A BLOCK AND PICK THE VOWEL', {
      fontFamily: '"Press Start 2P"', fontSize: '11px', color: '#ffff00'
    }).setOrigin(0.5);

    const menuBtn = this.add.text(width - 20, 20, '⌂ MENU', {
      fontFamily: '"Press Start 2P"', fontSize: '12px', color: '#fff',
      backgroundColor: '#221144', padding: { x: 8, y: 6 }
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));

    this.blocks = [];
    this.spawnBlock(420, height - 280);
    this.spawnBlock(700, height - 340);

    this.input.keyboard.on('keydown-LEFT', () => this.wade.setVelocityX(-220));
    this.input.keyboard.on('keydown-RIGHT', () => this.wade.setVelocityX(220));
    this.input.keyboard.on('keydown-SPACE', () => this.tryJump());
    this.input.keyboard.on('keydown-UP', () => this.tryJump());
    this.input.keyboard.on('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') this.wade.setVelocityX(0);
    });

    // Touch controls
    const mk = (x, y, label, down, up) => {
      const b = this.add.text(x, y, label, {
        fontFamily: '"Press Start 2P"', fontSize: '26px', color: '#fff',
        backgroundColor: '#444a88', padding: { x: 14, y: 14 }
      }).setOrigin(0.5).setInteractive();
      b.on('pointerdown', down);
      if (up) { b.on('pointerup', up); b.on('pointerout', up); }
    };
    mk(70, height - 70, '◀', () => this.wade.setVelocityX(-220), () => this.wade.setVelocityX(0));
    mk(180, height - 70, '▶', () => this.wade.setVelocityX(220), () => this.wade.setVelocityX(0));
    mk(width - 90, height - 70, '▲', () => this.tryJump());
  }

  tryJump() {
    if (this.wade.body.onFloor() || this.wade.body.touching.down) {
      this.wade.setVelocityY(-620);
    }
    this.tryBreakNearby();
  }

  spawnBlock(x, y) {
    const word = randomWord(this.blocks.map((b) => b.word));
    const parts = splitVowels(word);
    const c = this.add.container(x, y);
    const bg = this.add.image(0, 0, 'wordBlock');
    const label = this.add.text(
      0, 0,
      `${parts.consonantStart.toUpperCase()} _ ${parts.consonantEnd.toUpperCase()}`,
      { fontFamily: '"Press Start 2P"', fontSize: '22px', color: '#fff' }
    ).setOrigin(0.5);
    c.add([bg, label]);
    c.word = word;
    c.vowel = parts.vowel;
    c.broken = false;
    c.label = label;
    this.blocks.push(c);
    this.tweens.add({ targets: c, y: y + 10, duration: 1000, yoyo: true, repeat: -1 });
  }

  tryBreakNearby() {
    for (const b of this.blocks) {
      if (b.broken) continue;
      if (Phaser.Math.Distance.Between(this.wade.x, this.wade.y, b.x, b.y) < 150) {
        this.openVowelPrompt(b);
        return;
      }
    }
  }

  openVowelPrompt(block) {
    if (this.promptActive) return;
    this.promptActive = true;
    this.physics.pause();
    const { width, height } = this.scale;

    const overlay = this.add.rectangle(width / 2, height / 2, width, 260, 0x000000, 0.88);
    const title = this.add.text(width / 2, height / 2 - 60, 'PICK THE VOWEL SOUND', {
      fontFamily: '"Press Start 2P"', fontSize: '16px', color: '#ffff00'
    }).setOrigin(0.5);

    const buttons = VOWELS.map((v, i) => {
      const bx = width / 2 + (i - 2) * 90;
      const b = this.add.text(bx, height / 2 + 30, v.toUpperCase(), {
        fontFamily: '"Press Start 2P"', fontSize: '28px', color: '#000',
        backgroundColor: '#ffcc00', padding: { x: 14, y: 14 }
      }).setOrigin(0.5).setInteractive();
      b.on('pointerdown', () => finish(v));
      return b;
    });

    const ui = [overlay, title, ...buttons];
    const finish = (picked) => {
      ui.forEach((el) => el.destroy());
      this.input.keyboard.off('keydown', onKey);
      this.promptActive = false;
      if (picked === block.vowel) {
        block.broken = true;
        this.score += 10;
        this.scoreText.setText('SCORE  ' + this.score);
        this.tweens.add({
          targets: block, y: block.y - 100, alpha: 0, duration: 400,
          onComplete: () => block.destroy()
        });
        this.time.delayedCall(500, () => {
          this.spawnBlock(
            Phaser.Math.Between(300, width - 100),
            Phaser.Math.Between(220, 360)
          );
        });
      } else {
        this.cameras.main.shake(220, 0.012);
      }
      this.physics.resume();
    };

    const onKey = (e) => {
      const k = e.key.toLowerCase();
      if (VOWELS.includes(k)) finish(k);
    };
    this.input.keyboard.on('keydown', onKey);
  }
}
