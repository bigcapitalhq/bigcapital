import { Model } from 'objection';
// import TenantModel from 'models/TenantModel';
// import ModelSetting from './ModelSetting';
// import CustomViewBaseModel from './CustomViewBaseModel';
// import ModelSearchable from './ModelSearchable';
import { BaseModel } from '@/models/Model';
import { VendorCredit } from '../../VendorCredit/models/VendorCredit';
import { Bill } from '@/modules/Bills/models/Bill';

export class VendorCreditAppliedBill extends BaseModel {
  public amount!: number;
  public billId!: number;
  public vendorCreditId!: number;

  public vendorCredit!: VendorCredit;
  public bill!: Bill;

  /**
   * Table name
   */
  static get tableName() {
    return 'vendor_credit_applied_bill';
  }

  /**
   * Timestamps columns.
   */
  public get timestamps() {
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
