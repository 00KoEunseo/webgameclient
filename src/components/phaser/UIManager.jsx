import InventoryManager from './InventoryManager';

export default class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.inventoryManager = new InventoryManager(scene, this);
  }
}