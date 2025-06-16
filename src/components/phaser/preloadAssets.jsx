export default function preloadAssets(scene) {
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

  scene.load.spritesheet('fishSprite', '/sprites/fish.png', {
    frameWidth: 26,
    frameHeight: 12,
  });

  scene.load.spritesheet('pier_tiles', '/sprites/Pier_Tiles.png', {
    frameWidth: 32,
    frameHeight: 64,
  });

  
  scene.load.spritesheet('water', '/sprites/Water.png', {
    frameWidth: 96,
    frameHeight: 32,
  });
  
  scene.load.image('gacha', '/sprites/gacha.png',);

  scene.load.image('tutorial', '/sprites/toriel.png');

  scene.load.image('fishing_shop', '/sprites/Fishing_shop.png');
  
  scene.load.image('fishing_hut', '/sprites/Fishing_hut.png');
}
