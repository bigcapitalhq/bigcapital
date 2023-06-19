import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import WarehouseTransferSettings from './WarehouseTransfer.Settings';
import ModelSearchable from './ModelSearchable';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSetting from './ModelSetting';
import { DEFAULT_VIEWS } from '../services/Warehouses/WarehousesTransfers/constants';

export default class WarehouseTransfer extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
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
   * Determines whether the warehouse transfer initiated.
   * @retruns {boolean}
   */
  get isInitiated() {
    return !!this.transferInitiatedAt;
  }

  /**
   * Determines whether the warehouse transfer transferred.
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
    const WarehouseTransferEntry = require('models/WarehouseTransferEntry');
    const Warehouse = require('models/Warehouse');

    return {
      /**
       * View model may has many columns.
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: WarehouseTransferEntry.default,
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
        modelClass: Warehouse.default,
        join: {
          from: 'warehouses_transfers.fromWarehouseId',
          to: 'warehouses.id',
        },
      },

      toWarehouse: {
        relation: Model.BelongsToOneRelation,
        modelClass: Warehouse.default,
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
  static get meta() {
    return WarehouseTransferSettings;
  }

  /**
   * Retrieve the default custom views, roles and columns.
   */
  static get defaultViews() {
    return DEFAULT_VIEWS;
  }

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
