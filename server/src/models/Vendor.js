import { Model } from 'objection';
import TenantModel from '@/models/TenantModel';

export default class Vendor extends TenantModel {
  /**
   * Table name
   */
  static get tableName() {
    return 'vendors';
  }

  /**
   * Model timestamps.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Changes the vendor balance.
   * @param {Integer} customerId 
   * @param {Number} amount 
   * @return {Promise}
   */
  static async changeBalance(vendorId, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';

    return this.tenant()
      .query()
      .where('id', vendorId)
      [changeMethod]('balance', Math.abs(amount));
  }  

  /**
   * 
   * @param {number} vendorId - Specific vendor id.
   * @param {number} oldVendorId - The given old vendor id.
   * @param {number} amount - The new change amount.
   * @param {number} oldAmount - The old stored amount.
   */
  static changeDiffBalance(vendorId, oldVendorId, amount, oldAmount) {
    const diffAmount = (amount - oldAmount);
    const asyncOpers = [];

    if (vendorId != oldVendorId) {
      const oldVendorOper = Vendor.changeBalance(
        oldVendorId,
        (oldAmount * -1)
      );
      const vendorOper = Vendor.changeBalance(
        vendorId,
        amount,
      );
      asyncOpers.push(vendorOper);
      asyncOpers.push(oldVendorOper);
    } else {
      const balanceChangeOper = Vendor.changeBalance(vendorId, diffAmount);
      asyncOpers.push(balanceChangeOper);
    }
    return Promise.all(asyncOpers);
  }
}
