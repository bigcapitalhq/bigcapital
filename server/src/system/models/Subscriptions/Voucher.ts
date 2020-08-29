import { Model, mixin } from 'objection';
import moment from 'moment';
import SystemModel from '@/system/models/SystemModel';
import { IVouchersFilter } from '@/interfaces';

export default class Voucher extends mixin(SystemModel) {
  /**
   * Table name.
   */
  static get tableName() {
    return 'subscription_vouchers';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Model modifiers.
   */
  static get modifiers() {
    return {
      // Filters active vouchers.
      filterActiveVoucher(query) {
        query.where('disabled', false);
        query.where('used', false);
      },

      // Find voucher by its code or id.
      findByCodeOrId(query, id, code) {
        if (id) {
          query.where('id', id);
        }
        if (code) {
          query.where('voucher_code', code);
        }
      },

      // Filters vouchers list.
      filter(builder, vouchersFilter: IVouchersFilter) {
        if (vouchersFilter.active) {
          builder.modify('filterActiveVoucher')
        }
        if (vouchersFilter.disabled) {
          builder.where('disabled', true);
        }
        if (vouchersFilter.used) {
          builder.where('used', true);
        } 
        if (vouchersFilter.sent) {
          builder.where('sent', true);
        }
      }
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Plan = require('@/system/models/Subscriptions/Plan');

    return {
      plan: {
        relation: Model.BelongsToOneRelation,
        modelClass: Plan.default,
        join: {
          from: 'subscription_vouchers.planId',
          to: 'subscriptions_plans.id',
        },
      },
    };
  }

  /**
   * Deletes the given voucher code from the storage.
   * @param {string} voucherCode 
   * @return {Promise}
   */
  static deleteVoucher(voucherCode: string, viaAttribute: string = 'voucher_code') {
    return this.query()
      .where(viaAttribute, voucherCode)
      .delete();
  }

  /**
   * Marks the given voucher code as disabled on the storage.
   * @param {string} voucherCode 
   * @return {Promise}
   */
  static markVoucherAsDisabled(voucherCode: string, viaAttribute: string = 'voucher_code') {
    return this.query()
      .where(viaAttribute, voucherCode)
      .patch({
        disabled: true,
        disabled_at: moment().toMySqlDateTime(),
      });
  }

  /**
   * Marks the given voucher code as sent on the storage.
   * @param {string} voucherCode 
   */
  static markVoucherAsSent(voucherCode: string, viaAttribute: string = 'voucher_code') {
    return this.query()
      .where(viaAttribute, voucherCode)
      .patch({
        sent: true,
        sent_at: moment().toMySqlDateTime(),
      });
  }

  /**
   * Marks the given voucher code as used on the storage.
   * @param {string} voucherCode
   * @return {Promise}
   */
  static markVoucherAsUsed(voucherCode: string, viaAttribute: string = 'voucher_code') {
    return this.query()
      .where(viaAttribute, voucherCode)
      .patch({
        used: true,
        used_at: moment().toMySqlDateTime()
      });
  }
 
  /**
   * 
   * @param {IIPlan} plan 
   * @return {boolean}
   */
  isEqualPlanPeriod(plan) {
    return (this.invoicePeriod === plan.invoiceInterval &&
      voucher.voucherPeriod === voucher.periodInterval);
  }

}
