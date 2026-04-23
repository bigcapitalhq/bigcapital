import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { Account } from '@/modules/Accounts/models/Account.model';

export class ExpensePaymentSplit extends BaseModel {
  public expenseId!: number;
  public paymentAccountId!: number;
  public index!: number;
  public amount!: number;

  public paymentAccount?: Account;

  /**
   * Table name
   */
  static get tableName() {
    return 'expense_payment_splits';
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Account } = require('../../Accounts/models/Account.model');

    return {
      paymentAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'expense_payment_splits.paymentAccountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
