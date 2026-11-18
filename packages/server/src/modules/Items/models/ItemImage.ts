import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export type ItemImageType = 'front' | 'rear' | 'other';

export class ItemImage extends TenantBaseModel {
  public readonly id: number;
  public readonly itemId: number;
  public readonly key: string;
  public readonly thumbnailKey: string;
  public readonly type: ItemImageType;
  public readonly originName: string | null;
  public readonly mimeType: string | null;
  public readonly size: number | null;

  static get tableName() {
    return 'items_images';
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
    const { Item } = require('./Item');

    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'items_images.itemId',
          to: 'items.id',
        },
      },
    };
  }
}
