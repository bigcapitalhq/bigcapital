import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

/**
 * The batch allocation of an item entry.
 */
export class ItemEntryBatch extends TenantBaseModel {
  public id!: number;
  public entryId!: number;
  public batchId!: number;
  public quantity!: number;

  public createdAt?: Date;
  public updatedAt?: Date;

  /**
   * Table name.
   */
  static get tableName() {
    return 'items_entries_batches';
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mappings.
   */
  static get relationMappings() {
    const { ItemEntry } = require('./ItemEntry');
    const { Batch } = require('../../EE/Batches/models/Batch');

    return {
      entry: {
        relation: Model.BelongsToOneRelation,
        modelClass: ItemEntry,
        join: {
          from: 'items_entries_batches.entryId',
          to: 'items_entries.id',
        },
      },

      batch: {
        relation: Model.BelongsToOneRelation,
        modelClass: Batch,
        join: {
          from: 'items_entries_batches.batchId',
          to: 'batches.id',
        },
      },
    };
  }
}
