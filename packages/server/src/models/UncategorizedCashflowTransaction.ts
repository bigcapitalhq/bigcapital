/* eslint-disable global-require */
import TenantModel from 'models/TenantModel';
import { Model } from 'objection';

export default class UncategorizedCashflowTransaction extends TenantModel {
  amount: number;
  /**
   * Table name.
   */
  static get tableName() {
    return 'uncategorized_cashflow_transactions';
  }

  /**
   * Timestamps columns.
   */
  static get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Retrieves the withdrawal amount.
   * @returns {number}
   */
  public withdrawal() {
    return this.amount > 0 ? Math.abs(this.amount) : 0;
  }

  /**
   * Retrieves the deposit amount.
   * @returns {number}
   */
  public deposit() {
    return this.amount < 0 ? Math.abs(this.amount) : 0;
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['withdrawal', 'deposit'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('models/Account');

    return {
      /**
       * Transaction may has associated to account.
       */
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'uncategorized_cashflow_transactions.accountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
