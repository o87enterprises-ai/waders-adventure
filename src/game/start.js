import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { FighterScene } from './scenes/FighterScene.js';
import { PlatformerScene } from './scenes/PlatformerScene.js';
import { MiniMissionScene } from './scenes/MiniMissionScene.js';

// Boots the Phaser game inside `parent`. Client-side only (Phaser needs the DOM).
export function createGame(parent) {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
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
  });
  window.__game = game;
  return game;
}
