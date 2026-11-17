import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(0, 0, width, height, 0x1a0033).setOrigin(0);

    this.add.text(width / 2, 70, "WADER'S", {
      fontFamily: '"Press Start 2P"', fontSize: '40px',
      color: '#ff2d55', stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, 130, 'ADVENTURE', {
      fontFamily: '"Press Start 2P"', fontSize: '48px',
      color: '#ffff00', stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5);

    this.add.image(140, height - 140, 'wade').setScale(1.6);
    this.add.image(width - 140, height - 140, 'doom').setScale(1.6).setFlipX(true);

    this.makeButton(width / 2, 240, '⚔️  1v1 FIGHT', () => this.scene.start('FighterScene'));
    this.makeButton(width / 2, 320, '🏃  PLATFORMER', () => this.scene.start('PlatformerScene'));
    this.makeButton(width / 2, 400, '🧩  MINI MISSION', () => this.scene.start('MiniMissionScene'));
  }

  makeButton(x, y, label, onClick) {
    const btn = this.add.text(x, y, label, {
      fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#fff',
      backgroundColor: '#0066ff', padding: { x: 20, y: 14 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3388ff' }));
    btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#0066ff' }));
    btn.on('pointerdown', onClick);
    return btn;
  }
}
