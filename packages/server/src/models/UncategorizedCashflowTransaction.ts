/* eslint-disable global-require */
import TenantModel from 'models/TenantModel';
import { Model, ModelOptions, QueryContext } from 'objection';
import Account from './Account';

export default class UncategorizedCashflowTransaction extends TenantModel {
  id!: number;
  amount!: number;
  categorized!: boolean;
  accountId!: number;

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

  /**
   * Updates the count of uncategorized transactions for the associated account
   * based on the specified operation.
   * @param {QueryContext} queryContext - The query context for the transaction.
   * @param {boolean} increment - Indicates whether to increment or decrement the count.
   */
  private async updateUncategorizedTransactionCount(
    queryContext: QueryContext,
    increment: boolean
  ) {
    const operation = increment ? 'increment' : 'decrement';
    const amount = increment ? 1 : -1;

    await Account.query(queryContext.transaction)
      .findById(this.accountId)
      [operation]('uncategorized_transactions', amount);
  }

  /**
   * Runs after insert.
   * @param {QueryContext} queryContext
   */
  public async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    await this.updateUncategorizedTransactionCount(queryContext, true);
  }

  /**
   * Runs after update.
   * @param {ModelOptions} opt
   * @param {QueryContext} queryContext
   */
  public async $afterUpdate(
    opt: ModelOptions,
    queryContext: QueryContext
  ): Promise<any> {
    await super.$afterUpdate(opt, queryContext);

    if (this.id && this.categorized) {
      await this.updateUncategorizedTransactionCount(queryContext, false);
    }
  }

  /**
   * Runs after delete.
   * @param {QueryContext} queryContext
   */
  public async $afterDelete(queryContext: QueryContext) {
    await super.$afterDelete(queryContext);
    await this.updateUncategorizedTransactionCount(queryContext, false);
  }
}
