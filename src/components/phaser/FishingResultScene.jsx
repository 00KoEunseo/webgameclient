export default class FishingResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FishingResultScene' });
  }

  init(data) {
    // data: { fishName, size, price }
    this.fishName = data.fishName || '알 수 없음';
    this.size = data.size || '0 cm';
    this.price = data.price || '0 원';
  }

  preload() {
    // 필요한 이미지가 있다면 preload
  }

  create() {
    // 반투명 배경 (씬 전체 덮기)
    this.bg = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0x000000, 0)
      .setOrigin(0, 0);

    // UI 박스
    const boxX = (this.sys.game.config.width - 300) / 2;
    const boxY = (this.sys.game.config.height - 190) / 2;
    const box = this.add.rectangle(boxX, boxY, 300, 190, 0xffffff, 1).setOrigin(0, 0).setStrokeStyle(2, 0x333333);

    // 제목
    this.add.text(boxX + 150, boxY + 20, '낚시 성공!', { fontSize: '20px', color: '#000' }).setOrigin(0.5);

    // 내용
    this.add.text(boxX + 20, boxY + 60, `물고기 종류: ${this.fishName}`, { fontSize: '16px', color: '#000' });
    this.add.text(boxX + 20, boxY + 90, `크기: ${this.size}`, { fontSize: '16px', color: '#000' });
    this.add.text(boxX + 20, boxY + 120, `가격: ${this.price}`, { fontSize: '16px', color: '#000' });

    // 닫기 버튼
    const closeBtn = this.add.text(boxX + 150, boxY + 160, '닫기', {
      fontSize: '18px',
      backgroundColor: '#888',
      padding: { x: 10, y: 5 },
      color: '#fff',
      align: 'center',
      fixedWidth: 80
    }).setOrigin(0.5).setInteractive();

    closeBtn.on('pointerdown', () => {
      this.scene.stop(); // 결과창 씬 종료
    });
  }
}
