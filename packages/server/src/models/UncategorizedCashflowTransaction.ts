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
      'isRecognized',
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
   * Model modifiers.
   */
  static get modifiers() {
    return {
      /**
       * Filters the not excluded transactions.
       */
      notExcluded(query) {
        query.whereNull('excluded_at');
      },

      /**
       * Filters the excluded transactions.
       */
      excluded(query) {
        query.whereNotNull('excluded_at');
      },

      /**
       * Filter out the recognized transactions.
       * @param query
       */
      recognized(query) {
        query.whereNotNull('recognizedTransactionId');
      },

      /**
       * Filter out the not recognized transactions.
       * @param query
       */
      notRecognized(query) {
        query.whereNull('recognizedTransactionId');
      },

      categorized(query) {
        query.whereNotNull('categorizeRefType');
        query.whereNotNull('categorizeRefId');
      },

      notCategorized(query) {
        query.whereNull('categorizeRefType');
        query.whereNull('categorizeRefId');
      },
    };
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const Account = require('models/Account');
    const {
      RecognizedBankTransaction,
    } = require('models/RecognizedBankTransaction');
    const { MatchedBankTransaction } = require('models/MatchedBankTransaction');

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

      /**
       * Uncategorized transaction may has association to matched transaction.
       */
      matchedBankTransactions: {
        relation: Model.HasManyRelation,
        modelClass: MatchedBankTransaction,
        join: {
          from: 'uncategorized_cashflow_transactions.id',
          to: 'matched_bank_transactions.uncategorizedTransactionId',
        },
      },
    };
  }
}
