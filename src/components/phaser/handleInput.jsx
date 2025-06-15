import socket from '../socket';

export default function handleInput(scene, player, keys, isOverPortal) {
  const onGround = player.body.blocked.down;
  const currentAnimKey = player.anims.currentAnim?.key;
  const isHookAnimPlaying = ['hook', 'hook_rev'].includes(currentAnimKey);

  if (scene.isHookActive || isHookAnimPlaying) {
    player.setVelocityX(0);

    let offsetX, offsetY;

    // 훅 애니 시작 시 offset 조절 (왼쪽 바라볼 때 16px 오른쪽 이동)
    if (scene.isHookActive) {
      if (player.flipX) {
        offsetX = player.defaultBodyOffsetX + 16;
        offsetY = player.defaultBodyOffsetY;
      } else {
        offsetX = player.defaultBodyOffsetX;
        offsetY = player.defaultBodyOffsetY;
      }
      player.body.setOffset(offsetX, offsetY);
    }

    // 훅 애니메이션 재생 처리 및 위치 보정
    const offset = 8 * (player.flipX ? -1 : 1);

    if (scene.isHookActive && onGround) {
      if (currentAnimKey !== 'hook') {
        player.setX(player.x + offset);
        player.anims.play('hook');
      }
    } else if (!scene.isHookActive && currentAnimKey === 'hook') {
      player.anims.play('hook_rev');
    } else if (currentAnimKey === 'hook_rev') {
      const animProgress = player.anims.getProgress() ?? 0;

      if (animProgress >= 1) {
        player.setX(player.x - offset);
        player.anims.play('idle', true);

        // 판정박스 offset 원복
        offsetX = player.defaultBodyOffsetX;
        offsetY = player.defaultBodyOffsetY;
        player.body.setOffset(offsetX, offsetY);
      }
    }

    // **중복 emit 방지: 이전 상태 저장**
    if (!scene.lastSentMovement ||
        scene.lastSentMovement.x !== player.x ||
        scene.lastSentMovement.y !== player.y ||
        scene.lastSentMovement.anim !== player.anims.currentAnim?.key ||
        scene.lastSentMovement.flipX !== player.flipX ||
        scene.lastSentMovement.offsetX !== offsetX ||
        scene.lastSentMovement.offsetY !== offsetY) {

      socket.emit('playerMovement', {
        x: player.x,
        y: player.y,
        anim: player.anims.currentAnim?.key || 'idle',
        flipX: player.flipX,
        offsetX,
        offsetY,
      });

      scene.lastSentMovement = {
        x: player.x,
        y: player.y,
        anim: player.anims.currentAnim?.key || 'idle',
        flipX: player.flipX,
        offsetX,
        offsetY,
      };
    }

  } else {
    // 일반 이동 및 점프 처리
    player.setVelocityX(0);
    let anim = 'idle';
    let flipX = player.flipX;

    player.body.setOffset(player.defaultBodyOffsetX, player.defaultBodyOffsetY);
    const offsetX = player.defaultBodyOffsetX;
    const offsetY = player.defaultBodyOffsetY;

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

    if (!scene.lastSentMovement ||
        scene.lastSentMovement.x !== player.x ||
        scene.lastSentMovement.y !== player.y ||
        scene.lastSentMovement.anim !== anim ||
        scene.lastSentMovement.flipX !== flipX ||
        scene.lastSentMovement.offsetX !== offsetX ||
        scene.lastSentMovement.offsetY !== offsetY) {

      socket.emit('playerMovement', {
        x: player.x,
        y: player.y,
        anim,
        flipX,
        offsetX,
        offsetY,
      });

      scene.lastSentMovement = {
        x: player.x,
        y: player.y,
        anim,
        flipX,
        offsetX,
        offsetY,
      };
    }
  }

  // 포탈 사용 처리는 그대로 유지
  if (isOverPortal && keys.useportal.isDown && (currentAnimKey !== 'hook'&& currentAnimKey !== 'hook_rev')) {
    const currentPortal = scene.portals.find(p => p.name === scene.currentPortalName);
    if (!currentPortal)
      {
        console.log("잘못된 포탈.");
        return;
      }

    if (scene.currentPortalName === 'portal') {
      console.log("포탈들어가자!")
      scene.scene.start('SecondMapScene', {
        spawnX: currentPortal.destination?.x || 100,
        spawnY: currentPortal.destination?.y || 360,
      });
    } else if (scene.currentPortalName === 'portal2') {
      scene.scene.start('GameScene', {
        spawnX: currentPortal.destination?.x || 100,
        spawnY: currentPortal.destination?.y || 360,
      });
    } else if (scene.currentPortalName === 'portal3') {
      scene.scene.start('ThirdMapScene', {
        spawnX: currentPortal.destination?.x || 100,
        spawnY: currentPortal.destination?.y || 360,
      });
    } else if (scene.currentPortalName === 'portal4') {
      scene.scene.start('SecondMapScene', {
        spawnX: currentPortal.destination?.x || 100,
        spawnY: currentPortal.destination?.y || 360,
      });
    }
  }
}
