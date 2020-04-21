import { Model } from 'objection';
import path from 'path';
import TenantModel from '@/models/TenantModel';
import ResourceFieldMetadataCollection from '@/collection/ResourceFieldMetadataCollection';

export default class ResourceFieldMetadata extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'resource_custom_fields_metadata';
  }

  /**
   * Override the resource field metadata collection.
   */
  static get collection() {
    return ResourceFieldMetadataCollection;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    return {
      /**
       * Resource field may belongs to resource model.
       */
      resource: {
        relation: Model.BelongsToOneRelation,
        modelBase: path.join(__dirname, 'Resource'),
        join: {
          from: 'resource_fields.resource_id',
          to: 'resources.id',
        },
      },
    };
  }
}
