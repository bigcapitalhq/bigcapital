import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class ViewColumn extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'view_has_columns';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {

    return {

    };
  }
}
