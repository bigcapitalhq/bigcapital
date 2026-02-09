import { Warehouse } from '@/modules/Warehouses/models/Warehouse.model';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { Model } from 'objection';
import { ExportableModel } from '@/modules/Export/decorators/ExportableModel.decorator';
import { InjectModelMeta } from '@/modules/Tenancy/TenancyModels/decorators/InjectModelMeta.decorator';
import { ItemMeta } from './Item.meta';
import { ImportableModel } from '@/modules/Import/decorators/Import.decorator';
import { PreventMutateBaseCurrency } from '@/common/decorators/LockMutateBaseCurrency.decorator';
import { InjectModelDefaultViews } from '@/modules/Views/decorators/InjectModelDefaultViews.decorator';
import { ItemDefaultViews } from '../Items.constants';

@ExportableModel()
@ImportableModel()
@PreventMutateBaseCurrency()
@InjectModelMeta(ItemMeta)
@InjectModelDefaultViews(ItemDefaultViews)
export class Item extends TenantBaseModel {
  public readonly quantityOnHand: number;
  public readonly name: string;
  public readonly active: boolean;
  public readonly type: string;
  public readonly code: string;
  public readonly sellable: boolean;
  public readonly purchasable: boolean;
  public readonly costPrice: number;
  public readonly sellPrice: number;
  public readonly currencyCode: string;
  public readonly costAccountId: number;
  public readonly inventoryAccountId: number;
  public readonly categoryId: number;
  public readonly pictureUri: string;
  public readonly sellAccountId: number;
  public readonly sellDescription: string;
  public readonly purchaseDescription: string;
  public readonly landedCost: boolean;
  public readonly note: string;
  public readonly userId: number;
  public readonly sellTaxRateId: number;
  public readonly purchaseTaxRateId: number;

  public readonly warehouse!: Warehouse;

  static get tableName() {
    return 'items';
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      updateQuantityOnHand(query, value: number) {
        const q = query.where('type', 'inventory');

        if (value > 0) {
          q.increment('quantityOnHand', value);
        }
        if (value < 0) {
          q.decrement('quantityOnHand', Math.abs(value));
        }
        return q;
      },

      /**
       * Inactive/Active mode.
       */
      inactiveMode(query, active = false) {
        query.where('items.active', !active);
      },
    };
  }

  /**
   * Model search roles.
   */
  static get searchRoles() {
    return [
      { condition: 'or', fieldKey: 'name', comparator: 'contains' },
      { condition: 'or', fieldKey: 'code', comparator: 'like' },
    ];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    // const { Media } = require('../../Media/models/Media.model');
    const { Account } = require('../../Accounts/models/Account.model');
    const {
      ItemCategory,
    } = require('../../ItemCategories/models/ItemCategory.model');
    const {
      ItemWarehouseQuantity,
    } = require('../../Warehouses/models/ItemWarehouseQuantity');
    const {
      ItemEntry,
    } = require('../../TransactionItemEntry/models/ItemEntry');
    // const WarehouseTransferEntry = require('../../Warehouses/');
    const {
      InventoryAdjustmentEntry,
    } = require('../../InventoryAdjutments/models/InventoryAdjustmentEntry');
    const { TaxRateModel } = require('../../TaxRates/models/TaxRate.model');

    return {
      /**
       * Item may belongs to cateogory model.
       */
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemCategory,
        join: {
          from: 'items.categoryId',
          to: 'items_categories.id',
        },
      },

      /**
       * Item may belongs to cost account.
       */
      costAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'items.costAccountId',
          to: 'accounts.id',
        },
      },

      /**
       * Item may belongs to sell account.
       */
      sellAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'items.sellAccountId',
          to: 'accounts.id',
        },
      },

      /**
       * Item may belongs to inventory account.
       */
      inventoryAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'items.inventoryAccountId',
          to: 'accounts.id',
        },
      },

      /**
       * Item has many warehouses quantities.
       */
      itemWarehouses: {
        relation: Model.HasManyRelation,
        modelClass: ItemWarehouseQuantity,
        join: {
          from: 'items.id',
          to: 'items_warehouses_quantity.itemId',
        },
      },

      /**
       * Item may has many item entries.
       */
      itemEntries: {
        relation: Model.HasManyRelation,
        modelClass: ItemEntry,
        join: {
          from: 'items.id',
          to: 'items_entries.itemId',
        },
      },

      /**
       * Item may has many warehouses transfers entries.
       */
      // warehousesTransfersEntries: {
      //   relation: Model.HasManyRelation,
      //   modelClass: WarehouseTransferEntry,
      //   join: {
      //     from: 'items.id',
      //     to: 'warehouses_transfers_entries.itemId',
      //   },
      // },

      /**
       * Item has many inventory adjustment entries.
       */
      inventoryAdjustmentsEntries: {
        relation: Model.HasManyRelation,
        modelClass: InventoryAdjustmentEntry,
        join: {
          from: 'items.id',
          to: 'inventory_adjustments_entries.itemId',
        },
      },

      /**
       *
       */
      // media: {
      //   relation: Model.ManyToManyRelation,
      //   modelClass: Media.default,
      //   join: {
      //     from: 'items.id',
      //     through: {
      //       from: 'media_links.model_id',
      //       to: 'media_links.media_id',
      //     },
      //     to: 'media.id',
      //   },
      // },

      /**
       * Item may has sell tax rate.
       */
      sellTaxRate: {
        relation: Model.BelongsToOneRelation,
        modelClass: TaxRateModel,
        join: {
          from: 'items.sellTaxRateId',
          to: 'tax_rates.id',
        },
      },

      /**
       * Item may has purchase tax rate.
       */
      purchaseTaxRate: {
        relation: Model.BelongsToOneRelation,
        modelClass: TaxRateModel,
        join: {
          from: 'items.purchaseTaxRateId',
          to: 'tax_rates.id',
        },
      },
    };
  }
}
