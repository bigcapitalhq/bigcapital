import BaseModel from '@/models/Model';

export default class ExchangeRate extends BaseModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'exchange_rates';
  }
}
