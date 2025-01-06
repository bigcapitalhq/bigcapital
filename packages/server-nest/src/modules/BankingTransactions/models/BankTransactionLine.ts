/* eslint-disable global-require */
import { Model } from 'objection';
// import TenantModel from 'models/TenantModel';
import { BaseModel } from '@/models/Model';

export class BankTransactionLine extends BaseModel{
  /**
   * Table name.
   */
  static get tableName() {
    return 'cashflow_transaction_lines';
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Account } = require('../../Accounts/models/Account.model');

    return {
      cashflowAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'cashflow_transaction_lines.cashflowAccountId',
          to: 'accounts.id',
        },
      },
      creditAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'cashflow_transaction_lines.creditAccountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
