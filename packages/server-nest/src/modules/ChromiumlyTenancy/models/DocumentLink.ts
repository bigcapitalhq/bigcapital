import { Model, mixin } from 'objection';
// import TenantModel from 'models/TenantModel';
// import ModelSetting from './ModelSetting';
// import ModelSearchable from './ModelSearchable';
import { BaseModel } from '@/models/Model';

export class DocumentLink extends BaseModel{
  public modelRef: string;
  public modelId: number;
  public documentId: number;
  public expiresAt?: Date;

  /**
   * Table name
   */
  static get tableName() {
    return 'document_links';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Document = require('./Document');

    return {
      /**
       * Sale invoice associated entries.
       */
      document: {
        relation: Model.HasOneRelation,
        modelClass: Document.default,
        join: {
          from: 'document_links.documentId',
          to: 'documents.id',
        },
      },
    };
  }
}
