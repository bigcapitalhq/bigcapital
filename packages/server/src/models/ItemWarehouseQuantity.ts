import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class ItemWarehouseQuantity extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'items_warehouses_quantity';
  }

  static get relationMappings() {
    const Item = require('models/Item');
    const Warehouse = require('models/Warehouse');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item.default,
        join: {
          from: 'items_warehouses_quantity.itemId',
          to: 'items.id',
        },
      },
      warehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse.default,
        join: {
          from: 'items_warehouses_quantity.warehouseId',
          to: 'warehouses.id',
        },
      },
    };
  }
}
