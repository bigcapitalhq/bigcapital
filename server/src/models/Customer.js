import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class Customer extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'customers';
  }

  /**
   * Model timestamps.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      filterCustomerIds(query, customerIds) {
        query.whereIn('id', customerIds);
      },
    };
  }

  /**
   * Change vendor balance.
   * @param {Integer} customerId 
   * @param {Numeric} amount 
   */
  static async changeBalance(customerId, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';

    await this.tenant()
      .query()
      .where('id', customerId)
      [changeMethod]('balance', Math.abs(amount));
  }

  /**
   * Increment the given customer balance.
   * @param {Integer} customerId
   * @param {Integer} amount
   */
  static async incrementBalance(customerId, amount) {
    await this.tenant()
      .query()
      .where('id', customerId)
      .increment('balance', amount);
  }

  /**
   * Decrement the given customer balance.
   * @param {integer} customerId -
   * @param {integer} amount -
   */
  static async decrementBalance(customerId, amount) {
    await this.tenant()
      .query()
      .where('id', customerId)
      .decrement('balance', amount);
  }
}
