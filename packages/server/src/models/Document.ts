import { mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import ModelSearchable from './ModelSearchable';

export default class Document extends mixin(TenantModel, [
  ModelSetting,
  ModelSearchable,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'documents';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}
