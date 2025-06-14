export default function preloadAssets(scene) {
  scene.load.spritesheet('character', '/sprites/fisher.png', {
    frameWidth: 32,
    frameHeight: 32,
  });

  scene.load.spritesheet('tiles', '/sprites/world_tileset.png', {
    frameWidth: 16,
    frameHeight: 16,
  });
}
