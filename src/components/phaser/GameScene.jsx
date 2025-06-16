import Phaser from 'phaser';
import preloadAssets from './preloadAssets';
import createPlayer from './createPlayer';
import setupSocket from './setupSocket';
import handleInput from './handleInput';
import { createGround, createPortal, checkOverPortal } from './portalUtils';
import gameData from './GameData';
import UIManager from './UIManager';
import socket from '../socket';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.otherPlayersRef = {};
    this.socketId = null;
    this.isFishingCount = true;
    this.isCanHook = true;
    this.isHookActive = false;
    this.hookTimerStarted = false;
    this.isMiniGameActive = false;

    this.lastEnterStoreToggleTime = 0;  // 마지막 토글 시간 (ms)
    this.enterStoreCooldown = 300;      // 쿨타임 300ms (조절 가능)

    this.fishDatabase = [
      // 🎣 일반 물고기 25종
      { name: '광어', minSize: 30, maxSize: 70, pricePerCm: 150 },
      { name: '우럭', minSize: 20, maxSize: 50, pricePerCm: 120 },
      { name: '도미', minSize: 25, maxSize: 60, pricePerCm: 180 },
      { name: '농어', minSize: 40, maxSize: 90, pricePerCm: 200 },
      { name: '갈치', minSize: 50, maxSize: 120, pricePerCm: 100 },
      { name: '참돔', minSize: 30, maxSize: 70, pricePerCm: 170 },
      { name: '방어', minSize: 50, maxSize: 100, pricePerCm: 220 },
      { name: '고등어', minSize: 20, maxSize: 35, pricePerCm: 80 },
      { name: '전갱이', minSize: 15, maxSize: 30, pricePerCm: 70 },
      { name: '볼락', minSize: 10, maxSize: 25, pricePerCm: 60 },
      { name: '숭어', minSize: 30, maxSize: 60, pricePerCm: 140 },
      { name: '민어', minSize: 40, maxSize: 80, pricePerCm: 190 },
      { name: '노래미', minSize: 15, maxSize: 30, pricePerCm: 75 },
      { name: '쏘가리', minSize: 25, maxSize: 50, pricePerCm: 160 },
      { name: '배스', minSize: 20, maxSize: 45, pricePerCm: 130 },
      { name: '메기', minSize: 30, maxSize: 70, pricePerCm: 110 },
      { name: '잉어', minSize: 25, maxSize: 55, pricePerCm: 90 },
      { name: '붕어', minSize: 15, maxSize: 35, pricePerCm: 65 },
      { name: '연어', minSize: 40, maxSize: 100, pricePerCm: 210 },
      { name: '청어', minSize: 20, maxSize: 40, pricePerCm: 85 },
      { name: '대구', minSize: 50, maxSize: 100, pricePerCm: 195 },
      { name: '삼치', minSize: 60, maxSize: 120, pricePerCm: 115 },
      { name: '빙어', minSize: 5, maxSize: 10, pricePerCm: 300 },
      { name: '줄돔', minSize: 15, maxSize: 30, pricePerCm: 150 },
      { name: '청상어', minSize: 100, maxSize: 200, pricePerCm: 240}, // 보스급

      // 🗑️ 쓰레기 5종
      { name: '낡은 장화', minSize: 10, maxSize: 10, pricePerCm: 0 },
      { name: '녹슨 캔', minSize: 10, maxSize: 10, pricePerCm: 0 },
      { name: '찢어진 우산', minSize: 10, maxSize: 10, pricePerCm: 0 },
      { name: '플라스틱 병', minSize: 10, maxSize: 10, pricePerCm: 0 },
      { name: '고무 타이어 조각', minSize: 10, maxSize: 10, pricePerCm: 0 },
    ];
  }

  init(data) {
    this.spawnX = data.spawnX ?? 100;
    this.spawnY = data.spawnY ?? 360;
  }

  preload() {
    preloadAssets(this);
  }

  create() {
    // UIManager 생성
    this.uiManager = new UIManager(this);

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    //this.tutorialImage = this.add.image(centerX, centerY-40, 'tutorial');
    //this.tutorialImage.setOrigin(0.5);

    //this.add.image(100, 353, 'fishing_shop').setOrigin(0.5, 0.5);

    // 인벤토리에 게임데이터 연동
    this.uiManager.inventoryManager.refreshList();

    // 인벤토리 열기/닫기 (E 키 또는 가방 아이콘 누름 시)
    this.input.keyboard.on('keydown-E', () => {
      this.uiManager.inventoryManager.toggle();
    });

    this.cameras.main.setBackgroundColor('#87CEEB');

    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      jump: Phaser.Input.Keyboard.KeyCodes.UP,
      useportal: Phaser.Input.Keyboard.KeyCodes.DOWN,
      hook: Phaser.Input.Keyboard.KeyCodes.SPACE,
      enterstore: Phaser.Input.Keyboard.KeyCodes.ENTER
    });

    // isCanHook 상태일 때 낚시 가능.
    if (this.isCanHook) {
      this.keys.hook.on('down', () => {
        this.isHookActive = !this.isHookActive; // 토글 반전
      });
    }

    const platform = this.add.rectangle(469, 383, 700, 40, 0x000000, 0).setOrigin(0.5);
    this.physics.add.existing(platform, true); 

    const storebox = this.add.rectangle(485, 343, 110, 40, 0x000000, 0).setOrigin(0.5);
    this.physics.add.existing(storebox, true); 

    this.ground = createGround(this);
    this.add.image(120, 361, 'fishing_hut').setOrigin(0.5, 0.5);
    this.portals = [];
    this.portals.push(createPortal(this, this.ground, 46, 1.3, 'portal'));
    
    this.add.image(500, 332, 'fishing_shop').setOrigin(0.5, 0.5);
    this.add.sprite(262, 388, 'pier_tiles', 1).setOrigin(0.5, 0.5);
    this.add.sprite(326, 388, 'pier_tiles', 1).setOrigin(0.5, 0.5);
    this.add.sprite(390, 388, 'pier_tiles', 1).setOrigin(0.5, 0.5);
    this.add.sprite(454, 388, 'pier_tiles', 1).setOrigin(0.5, 0.5);
    this.add.sprite(518, 388, 'pier_tiles', 1).setOrigin(0.5, 0.5);
    this.add.sprite(518, 388, 'pier_tiles', 1).setOrigin(0.5, 0.5);
    this.add.sprite(582, 388, 'pier_tiles', 1).setOrigin(0.5, 0.5);
    this.add.sprite(646, 388, 'pier_tiles', 1).setOrigin(0.5, 0.5);
    this.add.sprite(710, 388, 'pier_tiles', 1).setOrigin(0.5, 0.5);
    this.add.sprite(774, 388, 'pier_tiles', 1).setOrigin(0.5, 0.5);
    for (let i = 0; i < 7; i++) {
      this.add.sprite(174 + i * 96, 398, 'water', 0).setOrigin(0.5, 0.5);
    }
    this.add.sprite(198, 368, 'tiles', 10).setOrigin(0.5, 0.5);
    this.add.sprite(206, 368, 'tiles', 10).setOrigin(0.5, 0.5);

    this.add.sprite(230, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);
    this.add.sprite(294, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);
    this.add.sprite(358, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);
    this.add.sprite(422, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);
    this.add.sprite(486, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);
    this.add.sprite(550, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);
    this.add.sprite(550, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);
    this.add.sprite(614, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);
    this.add.sprite(678, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);
    this.add.sprite(742, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);
    this.add.sprite(806, 388, 'pier_tiles', 0).setOrigin(0.5, 0.5);


    this.player = createPlayer(this, this.spawnX, this.spawnY);

    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.player, platform);

    this.otherPlayers = this.add.group();
    this.isOverPortal = false;
    this.isOverStore = false;

    this.physics.add.overlap(this.player, this.portals, () => {
      this.isOverPortal = true;
    });

    this.physics.add.overlap(this.player, storebox, () => {
      this.isOverStore = true;
    });

    setupSocket(this);
  }

  getRandomFish() {
    const fish = Phaser.Math.RND.pick(this.fishDatabase);
    const size = Phaser.Math.Between(fish.minSize, fish.maxSize);

    let price = 0;
    if (fish.priceCalc) {
      price = fish.priceCalc(size);
    } else {
      price = fish.pricePerCm * size;
    }

    return {
      fishName: fish.name,
      size: `${size} cm`,
      price: fish.pricePerCm === 0 ? '0 원' : `${price.toLocaleString()} 원`,
      isTrash: fish.pricePerCm === 0,
    };
  }


  startFishingTimer() {
    this.isFishingCount = false;
    this.hookTimerStarted = true;

    let exclamationShown = false;
    let exclamation;
    let failTimer;
    let hookTimer; // ← 이걸 저장해서 나중에 취소

    const spaceHandler = () => {
      // 너무 빠름: 느낌표 뜨기 전 SPACE 입력
      if (!exclamationShown && !this.isMiniGameActive) {
        console.log("낚시 실패 (너무 빠름)");
        this.isFishingCount = true;
        this.hookTimerStarted = false;
        
        // 타이머 제거
        hookTimer?.remove(false);
        this.input.keyboard.off('keydown-SPACE', spaceHandler);
        return;
      }

      // 정타 입력
      if (exclamationShown && !this.isMiniGameActive) {
        console.log("낚시 성공!");
        this.isMiniGameActive = true;
        exclamation?.destroy();
        failTimer?.remove(false);

        const fishData = this.getRandomFish();

        this.isMiniGameActive = false;
        this.isFishingCount = true;
        this.hookTimerStarted = false;

        this.input.keyboard.off('keydown-SPACE', spaceHandler);
        this.input.keyboard.enabled = false;
        this.scene.launch('FishingResultScene', {
          fishData,
          returnSceneKey: 'GameScene'
        });

      }
    };

    this.input.keyboard.on('keydown-SPACE', spaceHandler);

    const waitTime = Phaser.Math.Between(5000, 8000);

    // 느낌표 표시 예약 (이걸 실패 시 취소해야 함)
    hookTimer = this.time.delayedCall(waitTime, () => {
      exclamationShown = true;
      exclamation = this.add
        .sprite(this.player.x, this.player.y - 20, 'gacha')
        .setScrollFactor(0);

      failTimer = this.time.delayedCall(1500, () => {
        exclamation?.destroy();
        console.log("낚시 실패 (시간초과)");
        this.isFishingCount = true;
        this.hookTimerStarted = false;
        this.input.keyboard.off('keydown-SPACE', spaceHandler);
      });
    }, [], this);
  }

  update(time, delta) {
    this.isOverPortal = false;
    this.isOverStore = false;
    checkOverPortal(this);

    if (this.isHookActive && !this.hookTimerStarted && this.isFishingCount) {
      this.startFishingTimer();
    }

    if (this.keys.enterstore.isDown) {
      const now = this.time.now;  // Phaser 내부 시간 (ms)
      if (now - this.lastEnterStoreToggleTime > this.enterStoreCooldown) {
        this.uiManager.shopUI.toggle();
        this.lastEnterStoreToggleTime = now;
      }
    }

    handleInput(this, this.player, this.keys, this.isOverPortal, this.isOverStore);
  }
}
