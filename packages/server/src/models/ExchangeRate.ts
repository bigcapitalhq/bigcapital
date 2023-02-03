import bcrypt from 'bcryptjs';
import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

export default class ExchangeRate extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'exchange_rates';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Model defined fields.
   */
  static get fields(){
    return {
      currency_code: {
        label: 'Currency',
        column: 'currency_code'
      },
      exchange_rate: {
        label: 'Exchange rate',
        column: 'exchange_rate',
      },
      date: {
        label: 'Date',
        column: 'date',
      },
      created_at: {
        label: "Created at",
        column: "created_at",
        columnType: "date",
      },
    }
  }
}