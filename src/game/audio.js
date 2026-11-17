// Small audio helpers. Missing files are tolerated (Phaser logs, game continues).
export function playMusic(scene, key, volume = 0.45) {
  scene.sound.stopAll();
  if (!scene.cache.audio.exists(key)) return;
  scene.sound.play(key, { loop: true, volume });
  scene.events.once('shutdown', () => scene.sound.stopAll());
}

export function sfx(scene, key, volume = 0.7) {
  if (scene.cache.audio.exists(key)) scene.sound.play(key, { volume });
}

// Full-screen background image (960x540 source), stretched to the canvas.
export function addBackground(scene, key, fallbackColor) {
  const { width, height } = scene.scale;
  if (scene.textures.exists(key)) {
    return scene.add.image(0, 0, key).setOrigin(0).setDisplaySize(width, height);
  }
  return scene.add.rectangle(0, 0, width, height, fallbackColor).setOrigin(0);
}
