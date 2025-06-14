import Phaser from 'phaser';
import preloadAssets from './preloadAssets';
import createPlayer from './createPlayer';
import setupSocket from './setupSocket';
import handleInput from './handleInput';
import { createGround, createPortal, checkOverPortal } from './portalUtils';
import socket from '../socket';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.otherPlayersRef = {};
    this.socketId = null;
  }

  init(data) {
    this.spawnX = data.spawnX ?? 100;
    this.spawnY = data.spawnY ?? 360;
  }

  preload() {
    preloadAssets(this);
  }

  create() {
    this.cameras.main.setBackgroundColor('#87CEEB');

    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      jump: Phaser.Input.Keyboard.KeyCodes.UP,
      usepotal: Phaser.Input.Keyboard.KeyCodes.DOWN,
    });

    this.ground = createGround(this);
    this.portals = [];
    this.portals.push(createPortal(this, this.ground, 46, 0, 'portal'));

    this.player = createPlayer(this, this.spawnX, this.spawnY);
    this.physics.add.collider(this.player, this.ground);

    this.otherPlayers = this.add.group();
    this.isOverPortal = false;
    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.tutorialImage = this.add.image(centerX, centerY, 'tutorial');
    this.tutorialImage.setOrigin(0.5); // 이미지 기준점을 중앙으로 설정

    this.physics.add.overlap(this.player, this.portals, () => {
      this.isOverPortal = true;
    });

    setupSocket(this);
  }

  update() {
    this.isOverPortal = false;
    checkOverPortal(this);

    handleInput(this, this.player, this.keys, this.isOverPortal);
  }
}
