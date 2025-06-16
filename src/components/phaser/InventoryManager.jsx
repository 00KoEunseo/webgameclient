import gameData from './GameData';

export default class InventoryManager {
  constructor(scene, uiManager) {
    this.scene = scene;
    this.uiManager = uiManager;
    this.isOpen = false;
    this.selectedItemIndex = null;
    this.activeTab = 'fish';

    this.container = this.scene.add.container(0, 0).setDepth(100).setVisible(false);
    this.createUI();
  }

  createUI() {
    const width = this.scene.sys.game.config.width;
    const height = this.scene.sys.game.config.height;

    const boxW = 400, boxH = 300;
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;

    const defaultTextStyle = {
      fontSize: '18px',
      color: '#000',
      padding: { top: 6, bottom: 2 }
    };

    this.bg = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.5)
      .setOrigin(0)
      .setInteractive()
      .on('pointerdown', (pointer) => {
        const x = pointer.x;
        const y = pointer.y;
        const inBox = x >= boxX && x <= boxX + boxW && y >= boxY && y <= boxY + boxH;
        if (!inBox) this.close();
      });

    this.box = this.scene.add.rectangle(boxX, boxY, boxW, boxH, 0xffffff, 1)
      .setOrigin(0)
      .setStrokeStyle(2, 0x333333);

    this.titleText = this.scene.add.text(boxX + boxW / 2, boxY + 20, '인벤토리', {
      fontSize: '24px',
      color: '#000'
    }).setOrigin(0.5);

    this.closeBtn = this.scene.add.text(boxX + boxW - 60, boxY + 20, 'X', {
      fontSize: '24px',
      color: '#000'
    }).setOrigin(0.5).setInteractive();
    this.closeBtn.on('pointerdown', () => this.close());

    this.fishTabBtn = this.scene.add.text(boxX + 20, boxY + 50, '물고기', {
      fontSize: '18px',
      color: '#000',
      backgroundColor: '#ccc',
      padding: { top: 4, bottom: 2, left: 8, right: 8 }
    }).setInteractive().on('pointerdown', () => {
      this.activeTab = 'fish';
      this.refreshList();
    });

    this.equipTabBtn = this.scene.add.text(boxX + 100, boxY + 50, '장비', {
      fontSize: '18px',
      color: '#000',
      backgroundColor: '#eee',
      padding: { top: 4, bottom: 2, left: 8, right: 8 }
    }).setInteractive().on('pointerdown', () => {
      this.activeTab = 'equipment';
      this.refreshList();
    });

    this.listContainer = this.scene.add.container(boxX + 20, boxY + 80);

    this.detailText = this.scene.add.text(boxX + 220, boxY + 80, '', {
      ...defaultTextStyle,
      wordWrap: { width: 160 },
      padding: { x: 6, y: 4 }
    });

    this.equipButton = this.scene.add.text(boxX + 220, boxY + 220, '', {
      fontSize: '18px',
      color: '#000',
      backgroundColor: '#ddd',
      padding: { x: 10, y: 5 }
    }).setInteractive().setVisible(false);

    this.equipButton.on('pointerdown', () => {
      if (this.selectedItemIndex !== null) {
        const selectedRod = gameData.getEquipment()[this.selectedItemIndex];
        gameData.equipRod(selectedRod.name);
        this.selectItem(this.selectedItemIndex);
      }
    });

    this.goldText = this.scene.add.text(0, 0, '', {
      fontSize: '18px',
      color: '#000',
      backgroundColor: '#eee',
      padding: { top: 6, bottom: 3, left: 6, right: 6 }
    });
    this.goldText.setPosition(boxX + boxW - 140, boxY + boxH - 10).setOrigin(0, 1);

    this.container.add([
      this.bg, this.box, this.titleText, this.closeBtn,
      this.fishTabBtn, this.equipTabBtn,
      this.listContainer, this.detailText, this.goldText,
      this.equipButton
    ]);

    const maskShape = this.scene.make.graphics({});
    maskShape.fillRect(boxX + 20, boxY + 78, 180, 200);
    const mask = maskShape.createGeometryMask();
    this.listContainer.setMask(mask);

    this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      if (this.isOpen) {
        const newY = this.listContainer.y - deltaY * 0.5;
        const limit = boxY + 80;
        this.listContainer.y = Phaser.Math.Clamp(
          newY,
          limit - this.getListOverflow(),
          limit
        );
      }
    });
  }

  updateGoldText() {
    this.goldText.setText(`돈: ${gameData.getGold().toLocaleString()}원`);
  }

  refreshList() {
    this.listContainer.removeAll(true);
    this.selectedItemIndex = null;
    this.detailText.setText('');
    this.equipButton.setVisible(false);

    const items = this.activeTab === 'fish' ? gameData.getInventory() : gameData.getEquipment();

    if (items.length === 0) {
      const emptyText = this.scene.add.text(0, 0,
        this.activeTab === 'fish' ? '물고기가 없습니다.' : '장비가 없습니다.', {
          fontSize: '18px', color: '#666',
          padding: { x: 6, y: 4 }
        });
      this.listContainer.add(emptyText);
      return;
    }

    items.forEach((item, idx) => {
      const name = this.activeTab === 'fish' ? item.fishName : item.name;
      const itemText = this.scene.add.text(0, idx * 30 + 4, name, {
        fontSize: '18px',
        color: '#000',
        padding: { x: 6, y: 4 }
      }).setInteractive();

      itemText.on('pointerdown', () => {
        this.selectItem(idx);
      });

      this.listContainer.add(itemText);
    });
  }

  getListOverflow() {
    const items = this.activeTab === 'fish' ? gameData.getInventory() : gameData.getEquipment();
    const itemHeight = 30;
    const visibleHeight = 200;
    const totalHeight = items.length * itemHeight;
    return Math.max(0, totalHeight - visibleHeight);
  }

  selectItem(index) {
    this.selectedItemIndex = index;
    const item = this.activeTab === 'fish' ? gameData.getInventory()[index] : gameData.getEquipment()[index];

    if (this.activeTab === 'fish') {
      this.detailText.setText(
        `이름: ${item.fishName}\n크기: ${item.size}\n가격: ${item.price}`
      );
      this.equipButton.setVisible(false);
    } else {
      this.detailText.setText(
        `이름: ${item.name}\n\n${item.description}`
      );

      const isEquipped = gameData.equippedRod?.name === item.name;
      this.equipButton.setText(isEquipped ? '장착중' : '장착');
      this.equipButton.setInteractive(!isEquipped);
      this.equipButton.setVisible(true);
    }
  }

  open() {
    this.container.setVisible(true);
    this.isOpen = true;

    this.scene.input.keyboard.enabled = false;

    this.escHandler = (event) => {
      if (event.key === 'Escape' || event.key === 'e' || event.key === 'E') {
        this.close();
      }
    };
    window.addEventListener('keydown', this.escHandler);

    this.activeTab = 'fish';
    this.refreshList();
    this.updateGoldText();
  }

  close() {
    this.container.setVisible(false);
    this.isOpen = false;
    this.selectedItemIndex = null;
    this.detailText.setText('');
    this.equipButton.setVisible(false);

    this.scene.input.keyboard.enabled = true;
    window.removeEventListener('keydown', this.escHandler);
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }
}
