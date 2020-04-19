import BaseModel from '@/models/Model';

export default class Currency extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'currencies';
  }
}
