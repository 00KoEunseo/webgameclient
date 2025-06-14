export function createGround(scene) {
  const ground = scene.physics.add.staticGroup();
  const tileWidth = 16;
  const tileHeight = 16;
  const groundY = 400 - tileHeight / 2;
  const tilesCount = Math.ceil(800 / tileWidth);

  for (let i = 0; i < tilesCount; i++) {
    const x = tileWidth / 2 + i * tileWidth;
    const tile = scene.add.sprite(x, groundY, 'tiles', 0);
    scene.physics.add.existing(tile, true);
    tile.body.setSize(tileWidth, tileHeight);
    tile.body.setOffset(0);
    ground.add(tile);
  }

  return ground;
}

export function createPortal(scene, ground, tileIndex, heightIndex = 0, name = 'portal', destination = { x: 100, y: 360 }) {
  const tileWidth = 16;
  const tileHeight = 16;
  const groundY = 400 - tileHeight / 2;

  const portalBottomY = groundY - tileHeight * (heightIndex + 1);
  const portalTopY = groundY - tileHeight * (heightIndex + 2);
  const portalX = tileWidth / 2 + tileIndex * tileWidth;

  scene.add.sprite(portalX, portalTopY, 'tiles', 180);
  scene.add.sprite(portalX, portalBottomY, 'tiles', 196);

  const portal = scene.physics.add.staticSprite(portalX, (portalTopY + portalBottomY) / 2, 'tiles', 196);
  portal.setSize(tileWidth, tileHeight * 2);
  portal.setVisible(false);

  portal.name = name;
  portal.destination = destination; // 도착 위치 저장

  return portal;
}

export function checkOverPortal(scene) {
  scene.isOverPortal = false;
  scene.currentPortalName = null;

  for (const portal of scene.portals) {
    if (scene.physics.overlap(scene.player, portal)) {
      scene.isOverPortal = true;
      scene.currentPortalName = portal.name;
      //console.log('포탈 이름:', scene.currentPortalName);
      break; // 한 번 발견하면 루프 종료
    }
  }
}
