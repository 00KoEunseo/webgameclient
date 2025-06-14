import socket from '../socket';

export default function setupSocket(scene) {
  const { otherPlayersRef, otherPlayers } = scene;
  const sceneName = scene.scene.key; // ex: "GameScene", "SecondMapScene"

  const addOtherPlayer = (id, info) => {
    if (otherPlayersRef[id]) return;
    const other = scene.physics.add.sprite(info.x, info.y, 'character');

    // 충돌 박스 설정 (createPlayer와 동일하게)
    const bodyWidth = 16;    // 10px 줄인 너비
    const bodyHeight = 35;
    const spriteWidth = 32;
    const spriteHeight = 48;
    const offsetX = (spriteWidth - bodyWidth) / 2;  // 5
    const offsetY = spriteHeight - bodyHeight;      // 8

    other.body.setSize(bodyWidth, bodyHeight);
    other.body.setOffset(offsetX, offsetY);

    other.anims.play(info.anim || 'idle');
    other.flipX = info.flipX || false;
    otherPlayers.add(other);
    otherPlayersRef[id] = other;
  };

  const moveOtherPlayer = (id, info) => {
    const other = otherPlayersRef[id];
    if (!other) return;
    other.setPosition(info.x, info.y);
    other.anims.play(info.anim || 'idle', true);
    other.flipX = info.flipX || false;

    // offsetX, offsetY가 있으면 반영
    if (typeof info.offsetX === 'number' && typeof info.offsetY === 'number') {
      other.body.setOffset(info.offsetX, info.offsetY);
    }
  };

  const removeOtherPlayer = (id) => {
    if (otherPlayersRef[id]) {
      otherPlayersRef[id].destroy();
      delete otherPlayersRef[id];
    }
  };

  const clearAllOtherPlayers = () => {
    Object.keys(otherPlayersRef).forEach(removeOtherPlayer);
  };

  const setupEvents = () => {
    // 중복 방지: 기존 이벤트 제거
    socket.off('currentPlayers');
    socket.off('newPlayer');
    socket.off('playerMoved');
    socket.off('playerDisconnected');

    socket.on('currentPlayers', (players) => {
      clearAllOtherPlayers(); // 💡 다른 씬 유저 제거
      Object.entries(players).forEach(([id, info]) => {
        if (id !== scene.socketId) addOtherPlayer(id, info);
      });
    });

    socket.on('newPlayer', (info) => {
      if (info.id !== scene.socketId) addOtherPlayer(info.id, info);
    });

    socket.on('playerMoved', (info) => moveOtherPlayer(info.id, info));
    socket.on('playerDisconnected', removeOtherPlayer);
  };

  const registerSceneInfo = () => {
    socket.emit('set_scene', sceneName);
    socket.emit('requestCurrentPlayers', sceneName);
    socket.emit('newPlayerReady', sceneName);
  };

  if (socket.connected) {
    scene.socketId = socket.id;
    setupEvents();
    registerSceneInfo();
  } else {
    socket.once('connect', () => {
      scene.socketId = socket.id;
      setupEvents();
      registerSceneInfo();
    });
  }
}
