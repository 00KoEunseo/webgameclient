import Phaser from 'phaser';
import preloadAssets from './preloadAssets';
import createPlayer from './createPlayer';
import setupSocket from './setupSocket';
import handleInput from './handleInput';
import UIManager from './UIManager';

import { createGround, createPortal, checkOverPortal, createGround2 } from './portalUtils';

export default class SecondMapScene extends Phaser.Scene {
  constructor() {
    super('SecondMapScene');
    this.otherPlayersRef = {};
    this.socketId = null;

    // 낚시 관련 변수 추가
    this.isFishingCount = true;
    this.isCanHook = true;
    this.isHookActive = false;
    this.hookTimerStarted = false;
    this.isMiniGameActive = false;
    this.fishDatabase2 = [
      { name: '백상아리', minSize: 150, maxSize: 300, pricePerCm: 200 },
      { name: '큰귀상어', minSize: 130, maxSize: 260, pricePerCm: 175 },
      { name: '고래상어', minSize: 200, maxSize: 300, pricePerCm: 225 },
      { name: '청상아리', minSize: 140, maxSize: 280, pricePerCm: 190 },
      { name: '망치상어', minSize: 120, maxSize: 250, pricePerCm: 185 },
      { name: '가오리', minSize: 110, maxSize: 220, pricePerCm: 160 },
      { name: '황색무늬가오리', minSize: 130, maxSize: 240, pricePerCm: 170 },
      { name: '아마존 대형메기', minSize: 110, maxSize: 200, pricePerCm: 145 },
      { name: '피라루크', minSize: 150, maxSize: 280, pricePerCm: 180 },
      { name: '벨루가', minSize: 160, maxSize: 300, pricePerCm: 190 },
      { name: '흰긴수염고래', minSize: 180, maxSize: 300, pricePerCm: 210 },
      { name: '흑동가오리', minSize: 120, maxSize: 220, pricePerCm: 155 },
      { name: '개복치', minSize: 150, maxSize: 300, pricePerCm: 200 },
      { name: '골리앗 그루퍼', minSize: 120, maxSize: 250, pricePerCm: 175 },
      { name: '고블린샤크', minSize: 130, maxSize: 260, pricePerCm: 195 },
      { name: '대왕볼락', minSize: 140, maxSize: 240, pricePerCm: 170 },
      { name: '흰수염고래', minSize: 200, maxSize: 300, pricePerCm: 250 },
      { name: '청새치', minSize: 130, maxSize: 270, pricePerCm: 190 },
      { name: '청멸치', minSize: 5, maxSize: 15, pricePerCm: 60 },
      { name: '모래무지', minSize: 4, maxSize: 12, pricePerCm: 50 },
      { name: '베타피시', minSize: 3, maxSize: 7, pricePerCm: 70 },
      { name: '미꾸라지', minSize: 6, maxSize: 18, pricePerCm: 45 },
      { name: '송사리', minSize: 1, maxSize: 2, pricePerCm: 55 },
      { name: '피라냐', minSize: 10, maxSize: 20, pricePerCm: 100 },
      // 쓰레기
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
    // 필요하면 두번째 맵 전용 에셋도 추가 가능
  }

  create() {
    this.cameras.main.setBackgroundColor('#00008B');

    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      jump: Phaser.Input.Keyboard.KeyCodes.UP,
      useportal: Phaser.Input.Keyboard.KeyCodes.DOWN,
      hook: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this.uiManager = new UIManager(this);
    this.uiManager.inventoryManager.refreshList();
    this.input.keyboard.on('keydown-E', () => {
      this.uiManager.inventoryManager.toggle();
    });

    // 낚시 토글 기능 추가
    if (this.isCanHook) {
      this.keys.hook.on('down', () => {
        this.isHookActive = !this.isHookActive; // 토글 반전
      });
    }

    this.ground = createGround2(this);
    this.portals = [];
    this.portals.push(createPortal(this, this.ground, 4, 0, 'portal2', { x: 720, y: 339 }));
    this.portals.push(createPortal(this, this.ground, 45, 0, 'portal3'));

    this.player = createPlayer(this, this.spawnX, this.spawnY);
    this.physics.add.collider(this.player, this.ground);

    this.otherPlayers = this.add.group();
    this.isOverPortal = false;

    this.physics.add.overlap(this.player, this.portals, () => {
      this.isOverPortal = true;
    });

    setupSocket(this);

    // 낚시 타이머 시작 함수
    this.startFishingTimer = () => {
      this.isFishingCount = false;
      this.hookTimerStarted = true;

      let exclamationShown = false;
      let exclamation;
      let failTimer;
      let hookTimer;

      const spaceHandler = () => {
        // 너무 빠름: 느낌표 뜨기 전 SPACE 입력
        if (!exclamationShown && !this.isMiniGameActive) {
          console.log("낚시 실패 (너무 빠름)");
          this.isFishingCount = true;
          this.hookTimerStarted = false;

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
            returnSceneKey: 'SecondMapScene'  // 여기서 복귀할 씬 이름 지정
          });
        }
      };

      this.input.keyboard.on('keydown-SPACE', spaceHandler);

      const waitTime = Phaser.Math.Between(5000, 8000);

      hookTimer = this.time.delayedCall(waitTime, () => {
        exclamationShown = true;
        exclamation = this.add.sprite(this.player.x, this.player.y - 20, 'gacha').setScrollFactor(0);

        failTimer = this.time.delayedCall(1500, () => {
          exclamation?.destroy();
          console.log("낚시 실패 (시간초과)");
          this.isFishingCount = true;
          this.hookTimerStarted = false;
          this.input.keyboard.off('keydown-SPACE', spaceHandler);
        });
      }, [], this);
    };

    // 물고기 랜덤 선택 함수
    this.getRandomFish = () => {
      const fish = Phaser.Math.RND.pick(this.fishDatabase2);
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
        price: price,
        isTrash: fish.pricePerCm === 0,
      };
    };
  }

  update() {
    this.isOverPortal = false;
    this.currentPortalName = null;

    checkOverPortal(this);

    // 낚시 시작 조건 체크 및 타이머 실행
    if (this.isHookActive && !this.hookTimerStarted && this.isFishingCount) {
      this.startFishingTimer();
    }

    handleInput(this, this.player, this.keys, this.isOverPortal, this.currentPortalName);
  }
}
