export default function preloadAssets(scene) {
  scene.load.spritesheet('character', '/sprites/fisher.png', {
    frameWidth: 32,
    frameHeight: 32,
  });

  scene.load.spritesheet('character_walk', '/sprites/Fisherman_walk.png', {
    frameWidth: 32,   
    frameHeight: 48,
    spacing: 16,  // 프레임 사이 공백 크기
  });

  scene.load.spritesheet('character_idle', '/sprites/Fisherman_idle.png', {
    frameWidth: 32,   
    frameHeight: 48,
    spacing: 16,  // 프레임 사이 공백 크기
  });

  scene.load.spritesheet('character_hook', '/sprites/Fisherman_hook.png', {
    frameWidth: 48,
    frameHeight: 48,
  });

  scene.load.spritesheet('character_fishing', '/sprites/Fisherman_fish.png', {
    frameWidth: 48,
    frameHeight: 48,
  });

  scene.load.spritesheet('tiles', '/sprites/world_tileset.png', {
    frameWidth: 16,
    frameHeight: 16,
  });
  

  scene.load.image('tutorial', '/sprites/toriel.png');
}
