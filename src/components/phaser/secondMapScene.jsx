import Phaser from 'phaser';
import preloadAssets from './preloadAssets';
import createPlayer from './createPlayer';
import setupSocket from './setupSocket';
import handleInput from './handleInput';
import { createGround, createPortal, checkOverPortal } from './portalUtils';

export default class SecondMapScene extends Phaser.Scene {
  constructor() {
    super('SecondMapScene');
    this.otherPlayersRef = {};
    this.socketId = null;
  }

  init(data) {
    this.spawnX = data.spawnX ?? 100;
    this.spawnY = data.spawnY ?? 360;
  }

  preload() {
    preloadAssets(this);  // 필요하면 두번째 맵 전용 에셋도 여기에 추가
  }

  create() {
    this.cameras.main.setBackgroundColor('#228B22');

    this.keys = this.input.keyboard.addKeys({
        left: Phaser.Input.Keyboard.KeyCodes.LEFT,
        right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
        jump: Phaser.Input.Keyboard.KeyCodes.UP,
        usepotal: Phaser.Input.Keyboard.KeyCodes.DOWN,
    });

    this.ground = createGround(this);
    console.log('땅생성!');

    // 포탈 여러개 관리하는 배열
    this.portals = [];
    this.portals.push(createPortal(this, this.ground, 4, 0, 'portal2',{x:720,y:360}));

    this.player = createPlayer(this, this.spawnX, this.spawnY);
    this.physics.add.collider(this.player, this.ground);

    this.otherPlayers = this.add.group();
    this.isOverPortal = false;

    this.physics.add.overlap(this.player, this.portals, () => {
        this.isOverPortal = true;
    });

    setupSocket(this);
    }

    update() {
    this.isOverPortal = false;
    this.currentPortalName = null;

    checkOverPortal(this);  // 이 함수가 this.portals 배열의 모든 포탈에 대해 충돌 체크를 수행함

    handleInput(this, this.player, this.keys, this.isOverPortal, this.currentPortalName);
    }
}