// Campaign: an ordered list of levels. Each level type is a scene; the player
// moves through them in order and progress is saved in localStorage.
// Homework words (if any) only change which words appear — never what is playable.
import { sfx } from './audio.js';

const KEY = 'waders_progress';
const SCENE_FOR = { platformer: 'PlatformerScene', mission: 'MiniMissionScene', fight: 'FighterScene' };

export const LEVELS = [
  { type: 'platformer', name: 'ROOFTOP RUN', blocks: 2, screens: 1, bots: 1 },
  { type: 'platformer', name: 'CITY STREET', blocks: 3, screens: 2, bots: 2, spikes: 1 },
  { type: 'mission', name: 'SORT IT OUT', goal: 5 },
  { type: 'fight', name: 'DOOM BOT', enemy: 'BOT', hp: 2, scale: 1.7 },
  { type: 'platformer', name: 'FIRE ESCAPES', blocks: 4, screens: 3, bots: 3, spikes: 2, drones: 1, pits: 1 },
  { type: 'mission', name: 'WORD FAMILIES', goal: 8 },
  { type: 'platformer', name: 'DOOM TOWER', blocks: 5, screens: 4, bots: 4, spikes: 3, drones: 2, pits: 2 },
  { type: 'fight', name: 'DOCTOR DOOM', enemy: 'DOOM', hp: 5, scale: 2.2, boss: true }
];

export function getProgress() {
  try {
    const p = JSON.parse(localStorage.getItem(KEY));
    if (p && Number.isInteger(p.level) && p.level >= 0 && p.level < LEVELS.length) {
      return { level: p.level, score: p.score || 0 };
    }
  } catch { /* ignore */ }
  return { level: 0, score: 0 };
}

function saveProgress(p) {
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

export function resetProgress() {
  saveProgress({ level: 0, score: 0 });
}

export function levelLabel(idx) {
  return `LEVEL ${idx + 1}`;
}

export function startLevel(scene, idx) {
  scene.scene.start(SCENE_FOR[LEVELS[idx].type], { level: idx });
}

const FONT = '"Press Start 2P"';

// Brief title card at the start of a level (non-blocking).
export function showIntro(scene, idx) {
  const { width, height } = scene.scale;
  const L = LEVELS[idx];
  const t = scene.add.text(width / 2, height / 2 - 30,
    `${levelLabel(idx)}\n${L.name}`, {
      fontFamily: FONT, fontSize: '28px', color: '#ffff00', align: 'center',
      stroke: '#000', strokeThickness: 8, lineSpacing: 14
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
  scene.tweens.add({ targets: t, alpha: 0, delay: 1400, duration: 600, onComplete: () => t.destroy() });
}

// Shows the level-complete panel, saves progress, then advances on tap.
export function completeLevel(scene, idx, levelScore = 0) {
  const { width, height } = scene.scale;
  const prev = getProgress();
  const next = idx + 1;
  const total = prev.score + levelScore;
  const finished = next >= LEVELS.length;
  saveProgress({ level: finished ? 0 : Math.max(prev.level, next), score: finished ? 0 : total });

  scene.sound.stopAll();
  sfx(scene, 'sfx-win');

  const D = 300;
  scene.add.rectangle(0, 0, width, height, 0x000000, 0.8).setOrigin(0).setScrollFactor(0).setDepth(D);
  scene.add.text(width / 2, 70, finished ? 'YOU SAVED THE DAY!' : 'LEVEL COMPLETE!', {
    fontFamily: FONT, fontSize: '32px', color: '#00ff66', stroke: '#000', strokeThickness: 6
  }).setOrigin(0.5).setScrollFactor(0).setDepth(D + 1);
  if (scene.textures.exists('spideyCameo')) {
    const sp = scene.add.image(width / 2, 230, 'spideyCameo').setScale(1.6).setScrollFactor(0).setDepth(D + 1);
    scene.tweens.add({ targets: sp, y: 245, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
  scene.add.text(width / 2, 380, `SCORE  ${total}`, {
    fontFamily: FONT, fontSize: '20px', color: '#fff'
  }).setOrigin(0.5).setScrollFactor(0).setDepth(D + 1);
  const tap = scene.add.text(width / 2, 440,
    finished ? 'TAP FOR MENU' : `TAP FOR ${levelLabel(next)}: ${LEVELS[next].name}`, {
      fontFamily: FONT, fontSize: '14px', color: '#ffff00'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(D + 1);
  scene.tweens.add({ targets: tap, alpha: 0.3, duration: 500, yoyo: true, repeat: -1 });

  const go = () => (finished ? scene.scene.start('MenuScene') : startLevel(scene, next));
  scene.time.delayedCall(700, () => {
    scene.input.once('pointerdown', go);
    scene.input.keyboard.once('keydown', go);
  });
}
