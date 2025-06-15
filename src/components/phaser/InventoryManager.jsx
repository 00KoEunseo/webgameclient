import gameData from './GameData';

export default class InventoryManager {
  constructor(scene, uiManager) {
    this.scene = scene;
    this.uiManager = uiManager;
    this.isOpen = false;
    this.selectedFishIndex = null;

    this.container = this.scene.add.container(0, 0).setDepth(100).setVisible(false);

    this.createUI();
  }

  createUI() {
    const width = this.scene.sys.game.config.width;
    const height = this.scene.sys.game.config.height;

    // 인벤토리 박스 크기/위치
    const boxW = 400, boxH = 300;
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;

    // 반투명 배경
    this.bg = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.5)
      .setOrigin(0)
      .setInteractive()
      .on('pointerdown', (pointer) => {
        const x = pointer.x;
        const y = pointer.y;

        // 인벤토리 박스 내부를 클릭한 경우 닫지 않음
        const inBox =
          x >= boxX && x <= boxX + boxW &&
          y >= boxY && y <= boxY + boxH;

        if (!inBox) {
          this.close();
        }
      });

    // 인벤토리 박스
    this.box = this.scene.add.rectangle(boxX, boxY, boxW, boxH, 0xffffff, 1)
      .setOrigin(0)
      .setStrokeStyle(2, 0x333333);

    // 제목
    this.titleText = this.scene.add.text(boxX + boxW / 2, boxY + 20, '인벤토리', {
      fontSize: '24px', color: '#000'
    }).setOrigin(0.5);

    // 닫기 버튼
    this.closeBtn = this.scene.add.text(boxX + boxW - 60, boxY + 20, 'X', {
      fontSize: '24px', color: '#000'
    }).setOrigin(0.5).setInteractive();
    this.closeBtn.on('pointerdown', () => this.close());

    // 물고기 리스트 컨테이너
    this.listContainer = this.scene.add.container(boxX + 20, boxY + 60);

    // 상세 정보 텍스트
    this.detailText = this.scene.add.text(boxX + 220, boxY + 60, '', {
      fontSize: '18px', color: '#000', wordWrap: { width: 160 }
    });

    this.container.add([
      this.bg, this.box, this.titleText, this.closeBtn,
      this.listContainer, this.detailText
    ]);

    // 마스크
    const maskShape = this.scene.make.graphics({});
    maskShape.fillRect(boxX + 20, boxY + 58, 180, 224);
    const mask = maskShape.createGeometryMask();
    this.listContainer.setMask(mask);

    // 휠 스크롤 이벤트
    this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (this.isOpen) {
        const newY = this.listContainer.y - deltaY * 0.5;
        this.listContainer.y = Phaser.Math.Clamp(
          newY,
          boxY + 60 - this.getListOverflow(),
          boxY + 60
        );
      }
    });
  }

  refreshList() {
    this.listContainer.removeAll(true);
    this.selectedFishIndex = null;
    this.detailText.setText('');

    const inventory = gameData.getInventory();

    if (inventory.length === 0) {
      const noItemText = this.scene.add.text(0, 0, '잡은 물고기가 없습니다.', {
        fontSize: '18px', color: '#666'
      });
      this.listContainer.add(noItemText);
      return;
    }

    inventory.forEach((fish, idx) => {
      const itemText = this.scene.add.text(0, idx * 30+4, fish.fishName, {
        fontSize: '18px', color: '#000'
      }).setInteractive();

      itemText.on('pointerdown', () => {
        this.selectFish(idx);
      });

      this.listContainer.add(itemText);
    });
  }

  getListOverflow() {
    const itemHeight = 30;
    const visibleHeight = 220;
    const totalHeight = gameData.getInventory().length * itemHeight;
    return Math.max(0, totalHeight - visibleHeight);
  }

  selectFish(index) {
    this.selectedFishIndex = index;
    const fish = gameData.getInventory()[index];
    this.detailText.setText(
      `이름: ${fish.fishName}\n크기: ${fish.size}\n가격: ${fish.price}`
    );
  }

  open() {
    this.container.setVisible(true);
    this.isOpen = true;

    // 게임 씬 입력 차단
    this.scene.input.keyboard.enabled = false;

    // ESC 또는 E 키로 닫기 핸들러 등록
    this.escHandler = (event) => {
        if (event.key === 'Escape' || event.key === 'e' || event.key === 'E') {
        this.close();
        }
    };
    window.addEventListener('keydown', this.escHandler);

    // 리스트 최신화
    this.refreshList();
    }

  close() {
    this.container.setVisible(false);
    this.isOpen = false;
    this.selectedFishIndex = null;
    this.detailText.setText('');

    this.scene.input.keyboard.enabled = true;
    window.removeEventListener('keydown', this.escHandler);
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }
}
