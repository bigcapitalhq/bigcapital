import { Model } from 'objection';
import { BaseModel } from '@/models/Model';

export class SquareItemMapping extends BaseModel {
  public connectionId!: number;
  public squareCatalogObjectId!: string;
  public squareObjectType!: string;
  public squareName!: string | null;
  public squareSku!: string | null;
  public itemId!: number | null;
  public autoCreated!: boolean;

  static get tableName() {
    return 'square_item_mappings';
  }

  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  static get relationMappings() {
    const { Item } = require('../../Items/models/Item');
    const {
      SquareConnection,
    } = require('./SquareConnection.model');
    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'square_item_mappings.itemId',
          to: 'items.id',
        },
      },
      connection: {
        relation: Model.BelongsToOneRelation,
        modelClass: SquareConnection,
        join: {
          from: 'square_item_mappings.connectionId',
          to: 'square_connections.id',
        },
      },
    };
  }
}
