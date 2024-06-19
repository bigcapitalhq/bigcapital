/* eslint-disable global-require */
import * as R from 'ramda';
import { Model, ModelOptions, QueryContext, mixin } from 'objection';
import TenantModel from 'models/TenantModel';
import ModelSettings from './ModelSetting';
import Account from './Account';
import UncategorizedCashflowTransactionMeta from './UncategorizedCashflowTransaction.meta';

export default class UncategorizedCashflowTransaction extends mixin(
  TenantModel,
  [ModelSettings]
) {
  id!: number;
  date!: Date | string;
  amount!: number;
  categorized!: boolean;
  accountId!: number;
  referenceNo!: string;
  payee!: string;
  description!: string;
  plaidTransactionId!: string;
  recognizedTransactionId!: number;

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

  static get meta() {
    return UncategorizedCashflowTransactionMeta;
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
   * Detarmines whether the transaction is recognized.
   */
  public get isRecognized(): boolean {
    return !!this.recognizedTransactionId;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('models/Account');
    const {
      RecognizedBankTransaction,
    } = require('models/RecognizedBankTransaction');

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

      /**
       * Transaction may has association to recognized transaction.
       */
      recognizedTransaction: {
        relation: Model.HasOneRelation,
        modelClass: RecognizedBankTransaction,
        join: {
          from: 'uncategorized_cashflow_transactions.recognizedTransactionId',
          to: 'recognized_bank_transactions.id',
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
    increment: boolean,
    amount: number = 1
  ) {
    const operation = increment ? 'increment' : 'decrement';

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
