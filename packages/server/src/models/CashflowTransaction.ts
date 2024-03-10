/* eslint-disable global-require */
import { Model } from 'objection';
import TenantModel from 'models/TenantModel';
import {
  getCashflowAccountTransactionsTypes,
  getCashflowTransactionType,
} from '@/services/Cashflow/utils';
import AccountTransaction from './AccountTransaction';
import { CASHFLOW_DIRECTION } from '@/services/Cashflow/constants';
import { getTransactionTypeLabel } from '@/utils/transactions-types';
export default class CashflowTransaction extends TenantModel {
  transactionType: string;
  amount: number;
  exchangeRate: number;
  uncategorize: boolean;
  uncategorizedTransaction!: boolean;

  /**
   * Table name.
   */
  static get tableName() {
    return 'cashflow_transactions';
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
      'localAmount',
      'transactionTypeFormatted',
      'isPublished',
      'typeMeta',
      'isCashCredit',
      'isCashDebit',
    ];
  }

  /**
   * Retrieves the local amount of cashflow transaction.
   * @returns {number}
   */
  get localAmount() {
    return this.amount * this.exchangeRate;
  }

  /**
   * Detarmines whether the cashflow transaction is published.
   * @return {boolean}
   */
  get isPublished() {
    return !!this.publishedAt;
  }

  /**
   * Transaction type formatted.
   * @returns {string}
   */
  get transactionTypeFormatted() {
    return getTransactionTypeLabel(this.transactionType);
  }

  get typeMeta() {
    return getCashflowTransactionType(this.transactionType);
  }

  /**
   * Detarmines whether the cashflow transaction cash credit type.
   * @returns {boolean}
   */
  get isCashCredit() {
    return this.typeMeta?.direction === CASHFLOW_DIRECTION.OUT;
  }

  /**
   * Detarmines whether the cashflow transaction cash debit type.
   * @returns {boolean}
   */
  get isCashDebit() {
    return this.typeMeta?.direction === CASHFLOW_DIRECTION.IN;
  }

  /**
   * Detarmines whether the transaction imported from uncategorized transaction.
   * @returns {boolean}
   */
  get isCategroizedTranasction() {
    return !!this.uncategorizedTransaction;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const CashflowTransactionLine = require('models/CashflowTransactionLine');
    const AccountTransaction = require('models/AccountTransaction');
    const Account = require('models/Account');

    return {
      /**
       * Cashflow transaction entries.
       */
      entries: {
        relation: Model.HasManyRelation,
        modelClass: CashflowTransactionLine.default,
        join: {
          from: 'cashflow_transactions.id',
          to: 'cashflow_transaction_lines.cashflowTransactionId',
        },
        filter: (query) => {
          query.orderBy('index', 'ASC');
        },
      },

      /**
       * Cashflow transaction has associated account transactions.
       */
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: AccountTransaction.default,
        join: {
          from: 'cashflow_transactions.id',
          to: 'accounts_transactions.referenceId',
        },
        filter(builder) {
          const referenceTypes = getCashflowAccountTransactionsTypes();
          builder.whereIn('reference_type', referenceTypes);
        },
      },

      /**
       * Cashflow transaction may has associated cashflow account.
       */
      cashflowAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'cashflow_transactions.cashflowAccountId',
          to: 'accounts.id',
        },
      },

      /**
       * Cashflow transcation may has associated to credit account.
       */
      creditAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'cashflow_transactions.creditAccountId',
          to: 'accounts.id',
        },
      },
    };
  }
}
