import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { WarehouseTransfer } from './WarehouseTransfer';
import { Item } from '@/modules/Items/models/Item';

export class WarehouseTransferEntry extends TenantBaseModel {
  public warehouseTransferId!: number;
  public itemId!: number;
  public quantity!: number;
  public cost!: number;

  public warehouseTransfer!: WarehouseTransfer;
  public item!: Item;

  /**
   * Table name.
   */
  static get tableName() {
    return 'warehouses_transfers_entries';
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['total'];
  }

  /**
   * Invoice amount in local currency.
   * @returns {number}
   */
  get total() {
    return this.cost * this.quantity;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Item } = require('../../Items/models/Item');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'warehouses_transfers_entries.itemId',
          to: 'items.id',
        },
      },
    };
  }
}
