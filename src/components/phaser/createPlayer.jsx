export default function createPlayer(scene, spawnX = 100, spawnY = 360) {
  const player = scene.physics.add.sprite(spawnX, spawnY, 'character');
  player.setCollideWorldBounds(true);
  player.body.setGravityY(500);

  const bodyWidth = 16;  // 32 → 22 (10px 줄임)
  const bodyHeight = 35;
  const spriteWidth = 32;
  const spriteHeight = 48;

  const offsetX = (spriteWidth - bodyWidth) / 2;  // (32 - 22) / 2 = 5
  const offsetY = spriteHeight - bodyHeight;     // 48 - 40 = 8

  player.body.setSize(bodyWidth, bodyHeight);
  player.body.setOffset(offsetX, offsetY);

  player.defaultBodyOffsetX = offsetX;
  player.defaultBodyOffsetY = offsetY;

  scene.anims.create({
    key: 'walk',
    frames: scene.anims.generateFrameNumbers('character_walk', { start: 0, end: 5 }),
    frameRate: 6,
    repeat: -1,
  });

  scene.anims.create({
    key: 'idle',
    frames: scene.anims.generateFrameNumbers('character_idle', { start: 0, end: 3 }),
    frameRate: 3,
    repeat: -1,
  });

  scene.anims.create({
    key: 'fishing',
    frames: scene.anims.generateFrameNumbers('character_fishing', { start: 0, end: 3 }),
    frameRate: 3,
    repeat: -1,
  });


  scene.anims.create({
    key: 'hook',
    frames: scene.anims.generateFrameNumbers('character_hook', { start: 5, end: 0 }),
    frameRate: 10,
    repeat: 0,    
  });

  scene.anims.create({
    key: 'hook_rev',
    frames: scene.anims.generateFrameNumbers('character_hook', { start: 0, end: 5 }),
    frameRate: 10,
    repeat: 0,    
  });

  return player;
}
