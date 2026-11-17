import Phaser from 'phaser';
import { addBackground, playMusic } from '../audio.js';
import { LEVELS, getProgress, resetProgress, startLevel } from '../campaign.js';
import { customWordCount, clearWordBank } from '../../storage/wordBank.js';

const FONT = '"Press Start 2P"';

// Title screen: tap anywhere to start (or continue) the campaign.
export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const { width, height } = this.scale;
    addBackground(this, this.textures.exists('title') ? 'title' : 'bgMenu', 0x1a0033);
    playMusic(this, 'music-menu');

    const prog = getProgress();
    const resuming = prog.level > 0;

    if (resuming) {
      this.add.text(width / 2, height - 52, `CONTINUE  LEVEL ${prog.level + 1}: ${LEVELS[prog.level].name}`, {
        fontFamily: FONT, fontSize: '12px', color: '#ffff00', stroke: '#000', strokeThickness: 4
      }).setOrigin(0.5);
      this.small(width - 12, 12, 'NEW GAME', 1, 0, () => { resetProgress(); this.scene.restart(); });
    }

    this.wordLabel = this.small(12, 12, '', 0, 0, () => {
      if (customWordCount()) { clearWordBank(); this.refreshWords(); }
    });
    this.refreshWords();

    // Anywhere else on screen starts the game.
    const start = () => startLevel(this, prog.level);
    this.time.delayedCall(250, () => {
      this.input.on('pointerdown', (_p, over) => { if (!over.length) start(); });
      this.input.keyboard.once('keydown-ENTER', start);
      this.input.keyboard.once('keydown-SPACE', start);
    });
  }

  small(x, y, label, ox, oy, onClick) {
    const t = this.add.text(x, y, label, {
      fontFamily: FONT, fontSize: '10px', color: '#fff',
      backgroundColor: '#33336699', padding: { x: 6, y: 5 }
    }).setOrigin(ox, oy).setInteractive({ useHandCursor: true });
    t.on('pointerdown', onClick);
    return t;
  }

  refreshWords() {
    const n = customWordCount();
    this.wordLabel.setText(n ? `HOMEWORK WORDS: ${n}  (TAP TO RESET)` : 'WORDS: STANDARD');
  }
}
