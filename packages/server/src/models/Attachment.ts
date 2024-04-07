import TenantModel from 'models/TenantModel';
import { mixin } from 'objection';
import ModelSearchable from './ModelSearchable';
import ModelSetting from './ModelSetting';

export default class Attachment extends mixin(TenantModel, [ModelSetting, ModelSearchable]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'storage';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }
}
