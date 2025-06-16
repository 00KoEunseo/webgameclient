import gameData from './GameData';

export default class ShopUI {
  constructor(scene) {
    this.scene = scene;

    this.shopEquipments = [
    // 하급 낚시대 10종 (초급부터 중급 바로 아래까지)
    {
        name: '나무 낚시대',
        price: 2000,
        description: '나무가 거칠다\n낚시대\n속도 + 25%\n게이지 증가 + 5%',
        speed: 25,
        upBoxSize: 0,
        gaugeUp: 5,
        gaugeDown: 0,
    },
    {
        name: '대나무 낚시대',
        price: 7000,
        description: '가벼운 낚시대\n속도 + 30%\n판정박스 + 15%\n게이지 증가 + 10%',
        speed: 30,
        upBoxSize: 15,
        gaugeUp: 10,
        gaugeDown: 0,
    },
    {
        name: '간이 낚시대',
        price: 16000,
        description: '심플한 낚시대\n속도 + 45%',
        speed: 45,
        upBoxSize: 0,
        gaugeUp: 0,
        gaugeDown: 0,
    },
    {
        name: '철사 낚시대',
        price: 20000,
        description: '튼튼한 철사 낚시대\n속도 + 20%\n판정박스 + 30%\n게이지 증가 + 30%',
        speed: 20,
        upBoxSize: 30,
        gaugeUp: 30,
        gaugeDown: 0,
    },
    {
        name: '강철 낚시대',
        price: 30000,
        description: '강철 소재 낚시대\n판정박스 + 40%\n게이지 증가 + 40%',
        speed: 0,
        upBoxSize: 40,
        gaugeUp: 40,
        gaugeDown: 0,
    },
    {
        name: '경량 철제 낚시대',
        price: 50000,
        description: '경량화된 철제 낚시대\n속도 + 60%\n판정박스 + 30%\n게이지 증가 + 20%',
        speed: 60,
        upBoxSize: 30,
        gaugeUp: 20,
        gaugeDown: 0,
    },
    {
        name: '강화 철제 낚시대',
        price: 80000,
        description: '강화 처리된 철제 낚시대\n속도 + 35%\n판정박스 + 60%\n게이지 증가 + 20%\n게이지 감소 - 50%',
        speed: 35,
        upBoxSize: 60,
        gaugeUp: 20,
        gaugeDown: 50,
    },
    {
        name: '초경량 철제 낚시대',
        price: 90000,
        description: '초경량 소재 철제 낚시대\n속도 + 80%\n판정박스 + 50%\n게이지 증가 + 30%',
        speed: 80,
        upBoxSize: 50,
        gaugeUp: 30,
        gaugeDown: 0,
    },
    {
        name: '고강도 철제 낚시대',
        price: 100000,
        description: '고강도 합금 철제 낚시대\n속도 + 45%\n판정박스 + 60%\n게이지 증가 + 30%',
        speed: 45,
        upBoxSize: 60,
        gaugeUp: 30,
        gaugeDown: 0,
    },
    {
        name: '초중량 낚시대',
        price: 1000,
        description: '매우 무겁다\n속도 - 95%\n판정박스 + 170%\n게이지 증가 - 30%',
        speed: -95,
        upBoxSize: 170,
        gaugeUp: -30,
        gaugeDown: 0,
    },

    {
        name: '악마의 손',
        price: 1000,
        description: '매우 빠른 악마의 손\n속도 + 666%\n판정박스 - 80%\n',
        speed: 666,
        upBoxSize: -88,
        gaugeUp: 0,
        gaugeDown: 0,
    },

    // 상급 낚시대 10종 (중급 바로 위부터 최고급까지)
    {
        name: '고무줄 낚시대',
        price: 1000,
        description: '경금속 합금 낚시대\n속도 + 160%\n판정박스 + 100%\n게이지 증가 - 90%\n게이지 감소 + 99%',
        speed: 160,
        upBoxSize: 100,
        gaugeUp: -90,
        gaugeDown: -99,
    },
    {
        name: '티타늄 낚시대',
        price: 250000,
        description: '티타늄 소재 낚시대\n속도 + 70%\n판정박스 + 110%\n게이지 증가 + 40%',
        speed: 70,
        upBoxSize: 110,
        gaugeUp: 40,
        gaugeDown: 0,
    },
    {
        name: '합금 낚시대',
        price: 270000,
        description: '특수 합금 낚시대\n속도 + 80%\n판정박스 + 120%\n게이지 증가 + 45%',
        speed: 80,
        upBoxSize: 120,
        gaugeUp: 45,
        gaugeDown: 0,
    },
    {
        name: '초경량 합금 낚시대',
        price: 590000,
        description: '초경량 합금 소재 낚시대\n속도 + 90%\n판정박스 + 170%\n게이지 증가 + 50%',
        speed: 90,
        upBoxSize: 170,
        gaugeUp: 50,
        gaugeDown: 0,
    },
    {
        name: '초경량 마그네슘 합금 낚시대',
        price: 610000,
        description: '마그네슘 합금 낚시대\n속도 + 100%\n판정박스 + 200%\n게이지 감소 - 70%',
        speed: 100,
        upBoxSize: 200,
        gaugeUp: 0,
        gaugeDown: 70,
    },
    {
        name: '고성능 합금 낚시대',
        price: 730000,
        description: '고성능 합금 낚시대\n속도 + 110%\n판정박스 + 220%\n게이지 증가 + 60%',
        speed: 110,
        upBoxSize: 220,
        gaugeUp: 60,
        gaugeDown: 0,
    }
    ];

    this.selectedRodIndex = null;
    this.selectedFishIndex = null;

    this.goldText = null;
    this.rodListTexts = [];
    this.fishListTexts = [];

    this.detailText = null;
    this.buyButton = null;
    this.sellButton = null;

    this.isVisible = false; // 표시 상태

    this.container = this.scene.add.container(0, 0).setDepth(100).setVisible(false);

    this.createUI();

    // ESC 키로 닫기
    this.escKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.escKey.on('down', () => {
      if (this.isVisible) {
        this.close();
      }
    });
  }

  createUI() {
    const { scene, shopEquipments } = this;

    const bg = scene.add.rectangle(400, 200, 800, 400, 0x222222, 0.8);
    bg.setStrokeStyle(2, 0x555555);
    bg.setInteractive();
    this.container.add(bg);

    const rodTitle = scene.add.text(40, 40, '낚시대 목록', {
      fontSize: '18px',
      color: '#ffffff',
      padding: { top: 6, bottom: 2 },
    });
    this.container.add(rodTitle);

    this.rodListContainer = scene.add.container(40, 80);
        this.container.add(this.rodListContainer);

        shopEquipments.forEach((rod, i) => {
        const rodText = scene.add
            .text(0, i * 30, rod.name, {
            fontSize: '16px',
            color: '#aaaaff',
            padding: { top: 6, bottom: 2 },
            })
            .setInteractive()
            .on('pointerdown', () => {
            this.selectRod(i);
            });
        this.rodListTexts.push(rodText);
        this.rodListContainer.add(rodText);
        });

    const fishTitle = scene.add.text(560, 40, '내 물고기', {
      fontSize: '18px',
      color: '#ffffff',
      padding: { top: 6, bottom: 2 },
    });
    this.container.add(fishTitle);

    this.detailText = scene.add.text(270, 60, '왼쪽 낚시대 또는 오른쪽 물고기를 선택하세요.', {
      fontSize: '16px',
      color: '#ffffaa',
      wordWrap: { width: 250 },
      padding: { top: 6, bottom: 2 },
    });
    this.container.add(this.detailText);

    this.buyButton = scene
      .add.text(300, 200, '구매', {
        fontSize: '18px',
        backgroundColor: '#228822',
        padding: { top: 6, bottom: 2 },
      })
      .setInteractive()
      .on('pointerdown', () => this.buySelectedRod())
      .setAlpha(0.5);
    this.container.add(this.buyButton);

    this.sellButton = scene
      .add.text(300, 250, '판매', {
        fontSize: '18px',
        backgroundColor: '#882222',
        padding: { top: 6, bottom: 2 },
      })
      .setInteractive()
      .on('pointerdown', () => this.sellSelectedFish())
      .setAlpha(0.5);
    this.container.add(this.sellButton);

    this.goldText = scene.add.text(40, 360, `골드: ${gameData.getGold()}`, {
      fontSize: '20px',
      color: '#ffff00',
      padding: { top: 6, bottom: 2 },
    });
    this.container.add(this.goldText);

    scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const scrollSpeed = 10; // 민감도 조절

      let newY = this.rodListContainer.y - deltaY * scrollSpeed;

      // 스크롤 범위 제한 계산
      const maxScroll = 80; // 원래 y 위치 (최상단 위치)
      const minScroll = Math.min(400 - shopEquipments.length * 30, maxScroll);

      newY = Phaser.Math.Clamp(newY, minScroll, maxScroll);

      this.rodListContainer.y = newY;
    });

  }
  

  selectRod(index) {
    this.selectedRodIndex = index;
    this.selectedFishIndex = null;
    this.updateUI();
  }

  selectFish(index) {
    this.selectedFishIndex = index;
    this.selectedRodIndex = null;
    this.updateUI();
  }

  updateFishList() {
    this.fishListTexts.forEach((t) => {
      t.destroy();
      this.container.remove(t);
    });
    this.fishListTexts = [];

    const inventory = gameData.getInventory();
    if (inventory.length === 0) {
      const noFishText = this.scene.add.text(560, 80, '잡은 물고기가 없습니다.', {
        fontSize: '16px',
        color: '#888888',
        padding: { top: 6, bottom: 2 },
      });
      this.fishListTexts.push(noFishText);
      this.container.add(noFishText);
      return;
    }

    inventory.forEach((fish, i) => {
      const fishText = this.scene
        .add.text(560, 80 + i * 30, fish.fishName, {
          fontSize: '16px',
          color: '#aaffaa',
          padding: { top: 6, bottom: 2 },
        })
        .setInteractive()
        .on('pointerdown', () => {
          this.selectFish(i);
        });
      this.fishListTexts.push(fishText);
      this.container.add(fishText);
    });
  }

  updateUI() {
    const {
      selectedRodIndex,
      selectedFishIndex,
      shopEquipments,
      goldText,
      buyButton,
      sellButton,
      detailText,
      rodListTexts,
      fishListTexts,
    } = this;
    const gold = Number(gameData.getGold()) || 0;

    goldText.setText(`골드: ${gold}`);

    rodListTexts.forEach((text, i) => {
      text.setColor(i === selectedRodIndex ? '#ffff00' : '#aaaaff');
    });

    fishListTexts.forEach((text, i) => {
      text.setColor(i === selectedFishIndex ? '#ffff00' : '#aaffaa');
    });

    if (selectedRodIndex !== null) {
      const rod = shopEquipments[selectedRodIndex];
      const ownedNames = gameData.getEquipment().map((e) => e.name);
      const owned = ownedNames.includes(rod.name);

      detailText.setText(`${rod.name}\n\n${rod.description}\n\n가격: ${rod.price} 골드`);

      if (owned || gold < rod.price) {
        buyButton.setAlpha(0.5);
        buyButton.disableInteractive();
      } else {
        buyButton.setAlpha(1);
        buyButton.setInteractive();
      }

      sellButton.setAlpha(0.5);
      sellButton.disableInteractive();
    } else if (selectedFishIndex !== null) {
      const fish = gameData.getInventory()[selectedFishIndex];
      if (!fish) {
        detailText.setText('잘못된 물고기 선택');
        sellButton.setAlpha(0.5);
        sellButton.disableInteractive();
        buyButton.setAlpha(0.5);
        buyButton.disableInteractive();
        return;
      }

      detailText.setText(`${fish.fishName}\n\n가격: ${fish.price || 0} 골드`);

      sellButton.setAlpha(1);
      sellButton.setInteractive();

      buyButton.setAlpha(0.5);
      buyButton.disableInteractive();
    } else {
      detailText.setText('<-낚시대 구매   물고기 판매 ->');
      buyButton.setAlpha(0.5);
      buyButton.disableInteractive();
      sellButton.setAlpha(0.5);
      sellButton.disableInteractive();
    }
  }

  buySelectedRod() {
    if (this.selectedRodIndex === null) return;

    const rod = this.shopEquipments[this.selectedRodIndex];
    const ownedNames = gameData.getEquipment().map((e) => e.name);
    const gold = gameData.getGold();

    if (ownedNames.includes(rod.name)) {
      this.scene.sys.game.events.emit('alert', '이미 구매한 낚시대입니다.');
      return;
    }

    if (gold < rod.price) {
      this.scene.sys.game.events.emit('alert', '골드가 부족합니다.');
      return;
    }

    gameData.subtractGold(rod.price);
    gameData.addEquipment({
      name: rod.name,
      description: rod.description,
      setSpeedUp: rod.speed,
      setBoxUp: rod.upBoxSize,
      gaugeUp: rod.gaugeUp,
      gaugeDown: rod.gaugeDown,
    });

    this.scene.sys.game.events.emit('alert', `"${rod.name}" 을 구매했습니다!`);
    this.updateUI();
  }

  sellSelectedFish() {
    if (this.selectedFishIndex === null) return;

    const inventory = gameData.getInventory();
    if (this.selectedFishIndex >= inventory.length) return;

    const fish = inventory[this.selectedFishIndex];
    const price = fish.price || 0;

    gameData.removeItem(this.selectedFishIndex);
    gameData.addGold(price);

    this.selectedFishIndex = null;
    this.updateFishList();
    this.updateUI();

    this.scene.sys.game.events.emit('alert', `"${fish.fishName}" 을(를) ${price} 골드에 판매했습니다.`);
  }

  open() {
    this.container.setVisible(true);
    this.isVisible = true;
    this.updateFishList();
    this.updateUI();
  }

  close() {
    this.container.setVisible(false);
    this.isVisible = false;
  }

  toggle() {
    if (this.isVisible) {
      this.close();
    } else {
      this.open();
    }
  }
}
