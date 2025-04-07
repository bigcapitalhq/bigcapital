import { BaseModel } from '@/models/Model';
import { Model } from 'objection';

export class ItemWarehouseQuantity extends BaseModel{
  /**
   * Table name.
   */
  static get tableName() {
    return 'items_warehouses_quantity';
  }

  /**
   * Relation mappings.
   */
  static get relationMappings() {
    const { Item } = require('../../Items/models/Item');
    const { Warehouse } = require('./Warehouse.model');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'items_warehouses_quantity.itemId',
          to: 'items.id',
        },
      },
      warehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse,
        join: {
          from: 'items_warehouses_quantity.warehouseId',
          to: 'warehouses.id',
        },
      },
    };
  }
}
