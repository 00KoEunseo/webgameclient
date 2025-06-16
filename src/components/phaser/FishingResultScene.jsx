import gameData from './GameData';

export default class FishingResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FishingResultScene' });
  }

  init(data) {
    this.fishData = data.fishData;
    this.returnSceneKey = data.returnSceneKey || 'GameScene';
  }

  create() {
    this.bg = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0.5)
      .setOrigin(0, 0);

    this.startMiniGame();
  }

  startMiniGame() {
    this.hasResultCalled = false;

    const barX = this.sys.game.config.width / 2;
    const barY = this.sys.game.config.height / 2;
    const barHeight = 200;
    const barWidth = 20;

    // ✅ 장비 능력치 불러오기
    const rodStats = gameData.getEquippedRodStats();

    // ✅ 판정박스 크기 반영 (기본 30에 +%)
    const baseZoneHeight = 30;
    const successZoneHeight = baseZoneHeight * (1 + (rodStats.setBoxUp || 0) / 100);

    const bar = this.add.rectangle(barX, barY, barWidth, barHeight, 0xaaaaaa).setOrigin(0.5);
    const successZone = this.add.rectangle(barX, barY, barWidth, successZoneHeight, 0x00ff00).setOrigin(0.5);
    const marker = this.add.image(barX, barY, 'fishSprite').setOrigin(0.5).setScale(2, 2);

    let gauge = 50;
    const gaugeBarBg = this.add.rectangle(barX + 100, barY, 10, barHeight, 0x444444).setOrigin(0.5);
    const gaugeBar = this.add.rectangle(barX + 100, barY + barHeight / 2 - (barHeight * (gauge / 100)), 10, barHeight * (gauge / 100), 0x00ffff).setOrigin(0.5, 1);

    const size = parseFloat(this.fishData.size);

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    let speedMin, speedMax;
    if (size <= 5) {
      speedMin = 10;
      speedMax = 50;
    } else if (size < 300) {
      const t = (size - 5) / (300 - 5);
      speedMin = lerp(10, 200, t);
      speedMax = lerp(50, 400, t);
    } else if (size < 500) {
      const t = (size - 300) / (500 - 300);
      speedMin = lerp(200, 400, t);
      speedMax = lerp(400, 750, t);
    } else {
      speedMin = 400;
      speedMax = 750;
    }

    let markerSpeed = Phaser.Math.Between(speedMin, speedMax);
    let markerDir = Phaser.Math.Between(0, 1) === 0 ? -1 : 1;
    const directionChangeProbability = 0.02;

    // ✅ 장비 효과 반영한 이동 속도
    const moveSpeed = 100 * (1 + (rodStats.setSpeedUp || 0) / 100);
    let successZoneVelocity = 0;

    this.input.keyboard.on('keydown-SPACE', () => {
      successZoneVelocity = -moveSpeed;
    });

    this.input.keyboard.on('keyup-SPACE', () => {
      successZoneVelocity = moveSpeed;
    });

    this.miniGameTimer = this.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        const delta = 0.016;

        if (Math.random() < directionChangeProbability) {
          markerDir *= -1;
          markerSpeed = Phaser.Math.Between(speedMin, speedMax);
        }

        marker.y += markerSpeed * markerDir * delta;

        if (marker.y < barY - barHeight / 2) markerDir = 1;
        else if (marker.y > barY + barHeight / 2) markerDir = -1;

        successZone.y += successZoneVelocity * delta;
        const minY = barY - barHeight / 2 + successZone.height / 2;
        const maxY = barY + barHeight / 2 - successZone.height / 2;
        successZone.y = Phaser.Math.Clamp(successZone.y, minY, maxY);

        const inZone =
          marker.y > successZone.y - successZone.height / 2 &&
          marker.y < successZone.y + successZone.height / 2;

        // ✅ 장비 효과 반영한 게이지 증감량 계산
        const gaugeGain = 0.5 * (1 + (rodStats.gaugeUp || 0) / 100);
        const gaugeLoss = 0.5 * (1 - (rodStats.gaugeDown || 0) / 100);

        gauge += inZone ? gaugeGain : -gaugeLoss;
        gauge = Phaser.Math.Clamp(gauge, 0, 100);
        gaugeBar.height = barHeight * (gauge / 100);
        gaugeBar.y = barY;

        if ((gauge >= 100 || gauge <= 0) && !this.hasResultCalled) {
          this.hasResultCalled = true;
          this.miniGameTimer.remove();
          marker.destroy();
          successZone.destroy();
          bar.destroy();
          gaugeBar.destroy();
          gaugeBarBg.destroy();
          this.onMiniGameResult(gauge >= 100);
        }
      }
    });
  }

  onMiniGameResult(success) {
    if (success) {
      gameData.addItem(this.fishData);
    }

    const boxX = (this.sys.game.config.width - 300) / 2;
    const boxY = (this.sys.game.config.height - 190) / 2;

    const box = this.add.rectangle(boxX, boxY, 300, 190, 0xffffff, 1)
      .setOrigin(0, 0).setStrokeStyle(2, 0x333333);

    const title = success ? '낚시 성공!' : '물고기 놓침!';
    this.add.text(boxX + 150, boxY + 20, title, { fontSize: '20px', color: '#000' }).setOrigin(0.5);

    if (success) {
      const { fishName, size, price } = this.fishData;
      this.add.text(boxX + 20, boxY + 60, `물고기 종류: ${fishName}`, { fontSize: '16px', color: '#000' });
      this.add.text(boxX + 20, boxY + 90, `크기: ${size}`, { fontSize: '16px', color: '#000' });
      this.add.text(boxX + 20, boxY + 120, `가격: ${price}`, { fontSize: '16px', color: '#000' });
    } else {
      this.add.text(boxX + 20, boxY + 90, '다음엔 더 잘해보자!', { fontSize: '16px', color: '#000' });
    }

    const closeBtn = this.add.text(boxX + 150, boxY + 160, '닫기', {
      fontSize: '18px',
      backgroundColor: '#888',
      color: '#fff',
      align: 'center',
      fixedWidth: 80,
      padding: { top: 6, bottom: 2 }
    }).setOrigin(0.5).setInteractive();

    closeBtn.on('pointerdown', () => {
      if (this.returnSceneKey) {
        const returnScene = this.scene.get(this.returnSceneKey);
        if (returnScene && returnScene.input) {
          returnScene.input.keyboard.enabled = true;
        }
      }
      this.scene.stop();
    });
  }
}
