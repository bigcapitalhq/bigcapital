import { SeedDemoAbstract } from './SeedDemoAbstract';

export class SeedDemoAccountItems extends SeedDemoAbstract {
  /**
   * Retrieves the seeder file mapping.
   */
  get mapping() {
    return [
      { from: 'Item Type', to: 'type' },
      { from: 'Item Name', to: 'name' },
      { from: 'Item Code', to: 'code' },
      { from: 'Sellable', to: 'sellable' },
      { from: 'Purchasable', to: 'purchasable' },
      { from: 'Sell Price', to: 'sellPrice' },
      { from: 'Cost Price', to: 'costPrice' },
      { from: 'Cost Account', to: 'costAccountId' },
      { from: 'Sell Account', to: 'sellAccountId' },
      { from: 'Inventory Account', to: 'inventoryAccountId' },
      { from: 'Sell Description', to: 'sellDescription' },
      {
        from: 'Purchase Description',
        to: 'purchaseDescription',
      },
      { from: 'Note', to: 'note' },
      { from: 'Category', to: 'category' },
      { from: 'Active', to: 'active' },
    ];
  }

  /**
   * Retrieves the seeder file name.
   * @returns {string}
   */
  get importFileName() {
    return `items.csv`;
  }

  /**
   * Retrieve the resource name of the seeder.
   * @returns {string}
   */
  get resource() {
    return 'Item';
  }
}
