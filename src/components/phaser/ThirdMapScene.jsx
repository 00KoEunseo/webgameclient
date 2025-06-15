import Phaser from 'phaser';
import preloadAssets from './preloadAssets';
import createPlayer from './createPlayer';
import setupSocket from './setupSocket';
import handleInput from './handleInput';
import UIManager from './UIManager';

import { createGround, createPortal, checkOverPortal, createGround2 } from './portalUtils';

export default class ThirdMapScene extends Phaser.Scene {
  constructor() {
    super('ThirdMapScene');
    this.otherPlayersRef = {};
    this.socketId = null;

    // 낚시 관련 변수 추가
    this.isFishingCount = true;
    this.isCanHook = true;
    this.isHookActive = false;
    this.hookTimerStarted = false;
    this.isMiniGameActive = false;
    this.fishDatabase3 = [
    // 대형 물고기 (크기 220 ~ 400)
    { name: '범고래', minSize: 220, maxSize: 400, pricePerCm: 300 },
    { name: '대서양참다랑어', minSize: 230, maxSize: 380, pricePerCm: 280 },
    { name: '청새치', minSize: 220, maxSize: 360, pricePerCm: 270 },
    { name: '대왕오징어', minSize: 250, maxSize: 390, pricePerCm: 320 },
    { name: '가오리 (대형)', minSize: 230, maxSize: 370, pricePerCm: 260 },
    { name: '고래상어 (대형)', minSize: 280, maxSize: 400, pricePerCm: 350 },
    { name: '대왕고래상어', minSize: 300, maxSize: 400, pricePerCm: 400 },
    { name: '참다랑어', minSize: 220, maxSize: 350, pricePerCm: 290 },
    { name: '청상어 (대형)', minSize: 240, maxSize: 390, pricePerCm: 310 },
    { name: '백상아리 (대형)', minSize: 260, maxSize: 400, pricePerCm: 330 },
    { name: '대왕볼락 (대형)', minSize: 230, maxSize: 370, pricePerCm: 280 },
    { name: '흰긴수염고래 (대형)', minSize: 1500, maxSize: 3300, pricePerCm: 3600 }, //오타아님ㅋ
    { name: '황새치', minSize: 220, maxSize: 360, pricePerCm: 275 },
    { name: '검은망둥어', minSize: 225, maxSize: 375, pricePerCm: 265 },
    { name: '큰귀상어 (대형)', minSize: 240, maxSize: 380, pricePerCm: 290 },
    { name: '대왕가오리', minSize: 250, maxSize: 400, pricePerCm: 310 },
    { name: '아르헨티나 가오리', minSize: 220, maxSize: 350, pricePerCm: 260 },
    { name: '벨루가 (대형)', minSize: 270, maxSize: 400, pricePerCm: 320 },
    { name: '백상아리 (초대형)', minSize: 300, maxSize: 400, pricePerCm: 370 },
    { name: '흰수염고래 (초대형)', minSize: 320, maxSize: 400, pricePerCm: 380 },
    { name: '대왕고래', minSize: 350, maxSize: 400, pricePerCm: 400 },
    { name: '고래상어 (초대형)', minSize: 300, maxSize: 400, pricePerCm: 390 },

    // 소형 물고기 (크기 1 ~ 10)
    { name: '카디널피시', minSize: 1, maxSize: 5, pricePerCm: 40 },
    { name: '네온테트라', minSize: 2, maxSize: 6, pricePerCm: 50 },
    { name: '구피', minSize: 3, maxSize: 7, pricePerCm: 60 },

    // 쓰레기 (크기 10 고정, 가격 0)
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
    this.cameras.main.setBackgroundColor('#8B0000');

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
    this.portals.push(createPortal(this, this.ground, 4, 0, 'portal4', { x: 720, y: 360 }));

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
            returnSceneKey: 'ThirdMapScene'  // 여기서 복귀할 씬 이름 지정
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
      const fish = Phaser.Math.RND.pick(this.fishDatabase3);
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
