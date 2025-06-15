class GameData {
  constructor() {
    this.inventory = [];
  }

  addItem(item) {
    this.inventory.push(item);
  }

  getInventory() {
    return this.inventory;
  }
}

const gameData = new GameData();
export default gameData;