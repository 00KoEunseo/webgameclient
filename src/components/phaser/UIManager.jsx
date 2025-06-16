import InventoryManager from './InventoryManager';
import ShopUI from './ShopUI'

export default class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.inventoryManager = new InventoryManager(scene, this);
    this.shopUI = new ShopUI(scene, this);
  }
}