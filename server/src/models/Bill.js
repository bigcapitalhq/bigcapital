import { Model, mixin } from 'objection';
import moment from 'moment';
import { difference } from 'lodash';
import TenantModel from '@/models/TenantModel';
import CachableQueryBuilder from '@/lib/Cachable/CachableQueryBuilder';
import CachableModel from '@/lib/Cachable/CachableModel';


export default class Bill extends mixin(TenantModel, [CachableModel]) {
  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['dueAmount'];
  }

  /**
   * Table name
   */
  static get tableName() {
    return 'bills';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Due amount of the given.
   * @return {number}
   */
  get dueAmount() {
    return this.amount - this.paymentAmount;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Vendor = require('@/models/Vendor');
    const ItemEntry = require('@/models/ItemEntry');

    return {
      /**
       *
       */
      vendor: {
        relation: Model.BelongsToOneRelation,
        modelClass: this.relationBindKnex(Vendor.default),
        join: {
          from: 'bills.vendorId',
          to: 'vendors.id',
        },
      },

      /**
       * 
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: this.relationBindKnex(ItemEntry.default),
        join: {
          from: 'bills.id',
          to: 'items_entries.referenceId',
        },
      },
    };
  }

  /**
   * Retrieve the not found bills ids as array that associated to the given vendor.
   * @param {Array} billsIds 
   * @param {number} vendorId - 
   * @return {Array}
   */
  static async getNotFoundBills(billsIds, vendorId) {
    const storedBills = await this.tenant().query()
      .onBuild((builder) => {
        builder.whereIn('id', billsIds);

        if (vendorId) {
          builder.where('vendor_id', vendorId);
        }
      });
      
    const storedBillsIds = storedBills.map((t) => t.id);

    const notFoundBillsIds = difference(
      billsIds,
      storedBillsIds,
    );
    return notFoundBillsIds;
  }

  static changePaymentAmount(billId, amount) {
    const changeMethod = amount > 0 ? 'increment' : 'decrement';
    return this.tenant()
      .query()
      .where('id', billId)
      [changeMethod]('payment_amount', Math.abs(amount));
  }
}
