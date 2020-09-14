import { Model } from 'objection';
import TenantModel from 'models/TenantModel';

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
    const changeMethod = (amount > 0) ? 'increment' : 'decrement';

    return this.query()
      .where('id', customerId)
      [changeMethod]('balance', Math.abs(amount));
  }

  /**
   * Increment the given customer balance.
   * @param {Integer} customerId
   * @param {Integer} amount
   */
  static async incrementBalance(customerId, amount) {
    return this.query()
      .where('id', customerId)
      .increment('balance', amount);
  }

  /**
   * Decrement the given customer balance.
   * @param {integer} customerId -
   * @param {integer} amount -
   */
  static async decrementBalance(customerId, amount) {
    await this.query()
      .where('id', customerId)
      .decrement('balance', amount);
  }

  static changeDiffBalance(customerId, oldCustomerId, amount, oldAmount) {
    const diffAmount = amount - oldAmount;
    const asyncOpers = [];

    if (customerId != oldCustomerId) {
      const oldCustomerOper = this.changeBalance(oldCustomerId, (oldAmount * -1));
      const customerOper = this.changeBalance(customerId, amount);

      asyncOpers.push(customerOper);
      asyncOpers.push(oldCustomerOper);
    } else {
      const balanceChangeOper = this.changeBalance(customerId, diffAmount);
      asyncOpers.push(balanceChangeOper);
    }
    return Promise.all(asyncOpers);
  }
}
