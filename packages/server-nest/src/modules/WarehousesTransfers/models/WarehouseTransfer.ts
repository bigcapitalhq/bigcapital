import { Model, mixin } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { WarehouseTransferEntry } from './WarehouseTransferEntry';

export class WarehouseTransfer extends TenantBaseModel {
  public date!: Date;
  public transferInitiatedAt!: Date;
  public transferDeliveredAt!: Date;
  public fromWarehouseId!: number;
  public toWarehouseId!: number;

  public entries!: WarehouseTransferEntry[];
  public fromWarehouse!: Warehouse;
  public toWarehouse!: Warehouse;


  /**
   * Table name.
   */
  static get tableName() {
    return 'warehouses_transfers';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['isInitiated', 'isTransferred'];
  }

  /**
   * Detarmines whether the warehouse transfer initiated.
   * @retruns {boolean}
   */
  get isInitiated() {
    return !!this.transferInitiatedAt;
  }

  /**
   * Detarmines whether the warehouse transfer transferred.
   * @returns {boolean}
   */
  get isTransferred() {
    return !!this.transferDeliveredAt;
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      filterByDraft(query) {
        query.whereNull('transferInitiatedAt');
        query.whereNull('transferDeliveredAt');
      },
      filterByInTransit(query) {
        query.whereNotNull('transferInitiatedAt');
        query.whereNull('transferDeliveredAt');
      },
      filterByTransferred(query) {
        query.whereNotNull('transferInitiatedAt');
        query.whereNotNull('transferDeliveredAt');
      },
      filterByStatus(query, status) {
        switch (status) {
          case 'draft':
          default:
            return query.modify('filterByDraft');
          case 'in-transit':
            return query.modify('filterByInTransit');
          case 'transferred':
            return query.modify('filterByTransferred');
        }
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { WarehouseTransferEntry } = require('./WarehouseTransferEntry');
    const { Warehouse } = require('../../Warehouses/models/Warehouse.model');

    return {
      /**
       * View model may has many columns.
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: WarehouseTransferEntry,
        join: {
          from: 'warehouses_transfers.id',
          to: 'warehouses_transfers_entries.warehouseTransferId',
        },
      },

      /**
       *
       */
      fromWarehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse,
        join: {
          from: 'warehouses_transfers.fromWarehouseId',
          to: 'warehouses.id',
        },
      },

      toWarehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse,
        join: {
          from: 'warehouses_transfers.toWarehouseId',
          to: 'warehouses.id',
        },
      },
    };
  }

  /**
   * Model settings.
   */
  // static get meta() {
  //   return WarehouseTransferSettings;
  // }

  // /**
  //  * Retrieve the default custom views, roles and columns.
  //  */
  // static get defaultViews() {
  //   return DEFAULT_VIEWS;
  // }

  /**
   * Model search roles.
   */
  static get searchRoles() {
    return [
      // { fieldKey: 'name', comparator: 'contains' },
      // { condition: 'or', fieldKey: 'code', comparator: 'like' },
    ];
  }
}
