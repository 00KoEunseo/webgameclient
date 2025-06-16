class GameData {
  constructor() {
    this.inventory = []; // 물고기
    this.equipment = []; // 낚시대
    this.equippedRod = null; // 현재 장착한 낚시대

    this.addEquipment({
      name: '기본 낚시대1',
      description: '초보자용\n게이지 증가+ 20%\n게이지 감소 - 20%',
      setSpeedUp : 0,
      setBoxUp : 0,
      gaugeUp : 20,
      gaugeDown : 20
    });

    this.addEquipment({
      name: '기본 낚시대2',
      description: '초보자용\n속도 + 20%\n판정박스 + 20%',
      setSpeedUp : 20,
      setBoxUp : 20,
      gaugeUp : 0,
      gaugeDown : 0
    });

    this.equipRod('기본 낚시대1');

    this.gold = 0;
  }

  equipRod(rodName) {
    const rod = this.equipment.find(item => item.name === rodName);
    if (rod) {
      this.equippedRod = rod;
      console.log(`"${rod.name}" 장착 완료`);
    } else {
      console.warn(`장비 "${rodName}" 을(를) 찾을 수 없습니다.`);
    }
  }

  getEquippedRodStats() {
    return this.equippedRod || {
      setSpeedUp: 0,
      setBoxUp: 0,
      gaugeUp: 0,
      gaugeDown: 0,
    };
  }

  addItem(item) {
    this.inventory.push(item);
  }

  getInventory() {
    return this.inventory;
  }

  getGold() {
    return this.gold;
  }

  setGold(value) {
    this.gold = value;
  }

  addGold(amount) {
    this.gold += amount;
  }

  subtractGold(amount) {
    this.gold = Math.max(0, this.gold - amount); // 음수 방지
  }

  addEquipment(item) {
    this.equipment.push(item);
  }

  getEquipment() {
    return this.equipment;
  }

  removeItem(index) {
    if (index >= 0 && index < this.inventory.length) {
      return this.inventory.splice(index, 1)[0]; // 제거된 아이템 반환
    } else {
      console.warn(`잘못된 인덱스: ${index}`);
      return null;
    }
  }

}

const gameData = new GameData();
export default gameData;