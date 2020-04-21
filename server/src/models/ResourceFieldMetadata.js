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
}
