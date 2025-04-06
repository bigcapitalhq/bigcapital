import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';
import { Model, mixin } from 'objection';
import { DocumentModel } from './Document.model';

export class DocumentLinkModel extends TenantBaseModel {
  document!: DocumentModel;
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
    const { DocumentModel } = require('./Document');

    return {
      /**
       * Sale invoice associated entries.
       */
      document: {
        relation: Model.HasOneRelation,
        modelClass: DocumentModel,
        join: {
          from: 'document_links.documentId',
          to: 'documents.id',
        },
      },
    };
  }
}
