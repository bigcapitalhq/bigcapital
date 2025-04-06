import { Model, mixin } from 'objection';
// import TenantModel from 'models/TenantModel';
// import ModelSetting from './ModelSetting';
// import CustomViewBaseModel from './CustomViewBaseModel';
// import ModelSearchable from './ModelSearchable';
import { BaseModel } from '@/models/Model';
import { Account } from '@/modules/Accounts/models/Account.model';
import { VendorCredit } from '../../VendorCredit/models/VendorCredit';

export class RefundVendorCredit extends BaseModel {
  public vendorCreditId!: number;
  public amount!: number;
  public currencyCode!: string;
  public exchangeRate!: number;
  public referenceNo!: string;
  public depositAccountId!: number;
  public description!: string;
  public branchId!: number;
  public date!: Date;

  public vendorCredit!: VendorCredit;
  public depositAccount!: Account;

  /**
   * Table name.
   */
  static get tableName() {
    return 'refund_vendor_credit_transactions';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['created_at', 'updated_at'];
  }

  /*
   * Relationship mapping.
   */
  static get relationMappings() {
    const { VendorCredit } = require('../../VendorCredit/models/VendorCredit');
    const { Account } = require('../../Accounts/models/Account.model');

    return {
      depositAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'refund_vendor_credit_transactions.depositAccountId',
          to: 'accounts.id',
        },
      },
      vendorCredit: {
        relation: Model.BelongsToOneRelation,
        modelClass: VendorCredit,
        join: {
          from: 'refund_vendor_credit_transactions.vendorCreditId',
          to: 'vendor_credits.id',
        },
      },
    };
  }
}
