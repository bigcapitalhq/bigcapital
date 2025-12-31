import { Model } from 'objection';
import { BaseModel } from '@/models/Model';

export class ItemEntryTax extends BaseModel {
  public id!: number;
  public itemEntryId!: number;
  public taxRateId!: number;
  public taxRate!: number;
  public taxAmount!: number;
  public taxableAmount!: number;
  public order!: number;
  public createdAt?: Date;
  public updatedAt?: Date;

  /**
   * Table name.
   */
  static get tableName() {
    return 'items_entries_taxes';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { TaxRateModel } = require('./TaxRate.model');
    const { ItemEntry } = require('../../TransactionItemEntry/models/ItemEntry');

    return {
      /**
       * Tax rate reference.
       */
      taxRateRef: {
        relation: Model.BelongsToOneRelation,
        modelClass: TaxRateModel,
        join: {
          from: 'items_entries_taxes.taxRateId',
          to: 'tax_rates.id',
        },
      },

      /**
       * Item entry reference.
       */
      itemEntry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry,
        join: {
          from: 'items_entries_taxes.itemEntryId',
          to: 'items_entries.id',
        },
      },
    };
  }
}
