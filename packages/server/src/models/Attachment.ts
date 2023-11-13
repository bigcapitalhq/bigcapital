import { mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import ModelSearchable from './ModelSearchable';

export default class Attachment extends mixin(TenantModel, [
  ModelSetting,
  ModelSearchable,
]) {
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
