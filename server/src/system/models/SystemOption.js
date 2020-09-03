import { mixin } from 'objection';
import SystemModel from '@/system/models/SystemModel';

export default class Option extends SystemModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'options';
  }
}
