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
  public get withdrawal() {
    return this.amount < 0 ? Math.abs(this.amount) : 0;
  }

  /**
   * Retrieves the deposit amount.
   * @returns {number}
   */
  public get deposit(): number {
    return this.amount > 0 ? Math.abs(this.amount) : 0;
  }

  /**
   * Detarmines whether the transaction is deposit transaction.
   */
  public get isDepositTransaction(): boolean {
    return 0 < this.deposit;
  }

  /**
   * Detarmines whether the transaction is withdrawal transaction.
   */
  public get isWithdrawalTransaction(): boolean {
    return 0 < this.withdrawal;
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [
      'withdrawal',
      'deposit',
      'isDepositTransaction',
      'isWithdrawalTransaction',
    ];
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
