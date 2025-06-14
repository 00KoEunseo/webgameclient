export default function createPlayer(scene, spawnX = 100, spawnY = 360) {
  const player = scene.physics.add.sprite(spawnX, spawnY, 'character');
  player.setCollideWorldBounds(true);
  player.body.setGravityY(500);

  scene.anims.create({
    key: 'walk',
    frames: scene.anims.generateFrameNumbers('character', { start: 16, end: 23 }),
    frameRate: 12,
    repeat: -1,
  });

  scene.anims.create({
    key: 'idle',
    frames: scene.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
    frameRate: 6,
    repeat: -1,
  });

  return player;
}