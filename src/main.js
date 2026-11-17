import './styles.css';
import Phaser from 'phaser';
import { BootScene } from './game/scenes/BootScene.js';
import { MenuScene } from './game/scenes/MenuScene.js';
import { FighterScene } from './game/scenes/FighterScene.js';
import { PlatformerScene } from './game/scenes/PlatformerScene.js';
import { MiniMissionScene } from './game/scenes/MiniMissionScene.js';
import { handleHomeworkScan } from './homework/ocr.js';
import { setWordBank } from './storage/wordBank.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 540,
  backgroundColor: '#0a0014',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 900 }, debug: false }
  },
  scene: [BootScene, MenuScene, FighterScene, PlatformerScene, MiniMissionScene]
};

const game = new Phaser.Game(config);
window.__game = game;

const homeworkBtn = document.getElementById('homework-btn');
const homeworkInput = document.getElementById('homework-input');
const ocrStatus = document.getElementById('ocr-status');

homeworkBtn.addEventListener('click', () => homeworkInput.click());

homeworkInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  homeworkInput.value = ''; // allow re-uploading same file

  ocrStatus.hidden = false;
  ocrStatus.textContent = 'Reading homework… 0%';
  try {
    const words = await handleHomeworkScan(file, (pct) => {
      ocrStatus.textContent = `Reading homework… ${Math.round(pct * 100)}%`;
    });
    if (words.length === 0) {
      ocrStatus.textContent = 'No reading words found. Try a clearer photo!';
      setTimeout(() => (ocrStatus.hidden = true), 3000);
      return;
    }
    setWordBank(words);
    // Bonus feature: just swaps the word list. Never interrupts the current level;
    // new words appear from the next block / word / round on.
    ocrStatus.textContent = `Found ${words.length} words! They're in the game now.`;
    setTimeout(() => (ocrStatus.hidden = true), 2500);
    const menu = game.scene.getScene('MenuScene');
    if (menu && menu.scene.isActive()) menu.refreshWords();
  } catch (err) {
    console.error(err);
    ocrStatus.textContent = 'Scan failed. Please try again.';
    setTimeout(() => (ocrStatus.hidden = true), 3000);
  }
});
