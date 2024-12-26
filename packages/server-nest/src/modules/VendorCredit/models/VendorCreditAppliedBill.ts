import { mixin, Model } from 'objection';
// import TenantModel from 'models/TenantModel';
// import ModelSetting from './ModelSetting';
// import CustomViewBaseModel from './CustomViewBaseModel';
// import ModelSearchable from './ModelSearchable';
import { BaseModel } from '@/models/Model';

export class VendorCreditAppliedBill extends BaseModel {
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
    const { Bill } = require('../../Bills/models/Bill');
    const { VendorCredit } = require('../../VendorCredit/models/VendorCredit');

    return {
      bill: {
        relation: Model.BelongsToOneRelation,
        modelClass: Bill,
        join: {
          from: 'vendor_credit_applied_bill.billId',
          to: 'bills.id',
        },
      },

      vendorCredit: {
        relation: Model.BelongsToOneRelation,
        modelClass: VendorCredit,
        join: {
          from: 'vendor_credit_applied_bill.vendorCreditId',
          to: 'vendor_credits.id',
        },
      },
    };
  }
}
