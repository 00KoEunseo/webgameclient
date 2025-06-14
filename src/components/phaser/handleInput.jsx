import socket from '../socket';

export default function handleInput(scene, player, keys, isOverPortal) {
  const onGround = player.body.blocked.down;
  player.setVelocityX(0);

  let anim = 'idle';
  let flipX = player.flipX;

  if (keys.left.isDown) {
    player.setVelocityX(-100);
    anim = 'walk';
    flipX = true;
    player.flipX = true;
  } else if (keys.right.isDown) {
    player.setVelocityX(100);
    anim = 'walk';
    flipX = false;
    player.flipX = false;
  }

  if (keys.jump.isDown && onGround) {
    player.setVelocityY(-250);
  }

  player.anims.play(anim, true);

if (isOverPortal && keys.usepotal.isDown) {

  // 포탈 정보 찾기
  const currentPortal = scene.portals.find(p => p.name === scene.currentPortalName);

  if (!currentPortal) return; // 포탈 못 찾으면 아무 것도 안 함

  // 첫 번째 맵에서 두 번째 맵으로 이동
  if (scene.currentPortalName === 'portal') {
    scene.scene.start('SecondMapScene', {
      spawnX: currentPortal.destination?.x || 100,
      spawnY: currentPortal.destination?.y || 360,
    });
  }

  // 두 번째 맵에서 첫 번째 맵으로 이동
  if (scene.currentPortalName === 'portal2') {
    scene.scene.start('GameScene', {
      spawnX: currentPortal.destination?.x || 100,
      spawnY: currentPortal.destination?.y || 360,
    });
  }
}

  socket.emit('playerMovement', {
    x: player.x,
    y: player.y,
    anim,
    flipX,
  });
}

