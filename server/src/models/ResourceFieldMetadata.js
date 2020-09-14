import TenantModel from 'models/TenantModel';

export default class ResourceFieldMetadata extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'resource_custom_fields_metadata';
  }
}
