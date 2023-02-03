import { mixin, Model } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSetting from './ModelSetting';
import CustomViewBaseModel from './CustomViewBaseModel';
import ModelSearchable from './ModelSearchable';

export default class VendorCreditAppliedBill extends mixin(TenantModel, [
  ModelSetting,
  CustomViewBaseModel,
  ModelSearchable,
]) {
  /**
   * Table name
   */
  static get tableName() {
    return 'vendor_credit_applied_bill';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Bill = require('models/Bill');
    const VendorCredit = require('models/VendorCredit');

    return {
      bill: {
        relation: Model.BelongsToOneRelation,
        modelClass: Bill.default,
        join: {
          from: 'vendor_credit_applied_bill.billId',
          to: 'bills.id',
        },
      },

      vendorCredit: {
        relation: Model.BelongsToOneRelation,
        modelClass: VendorCredit.default,
        join: {
          from: 'vendor_credit_applied_bill.vendorCreditId',
          to: 'vendor_credits.id',
        },
      },
    };
  }
}
