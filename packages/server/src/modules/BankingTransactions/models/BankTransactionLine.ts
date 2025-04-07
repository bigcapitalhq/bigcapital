/* eslint-disable global-require */
import { Model } from 'objection';
import { TenantBaseModel } from '@/modules/System/models/TenantBaseModel';

export class BankTransactionLine extends TenantBaseModel{
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
   * Determine whether the model is resourceable.
   * @returns {boolean}
   */
  static get resourceable(): boolean {
    return false;
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
