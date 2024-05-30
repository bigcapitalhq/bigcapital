import { Model, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import ModelSearchable from './ModelSearchable';

export default class DocumentLink extends mixin(TenantModel, [
  ModelSetting,
  ModelSearchable,
]) {
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
    const Document = require('models/Document');

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
