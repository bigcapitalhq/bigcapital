import TenantModel from 'models/TenantModel';
import { Model } from 'objection';

export class RecognizedBankTransaction extends TenantModel {
  /**
   * Table name.
   */
  static get tableName() {
    return 'recognized_bank_transactions';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return [];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return [];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const UncategorizedCashflowTransaction = require('./UncategorizedCashflowTransaction');
    const Account = require('./Account');
    const { BankRule } = require('./BankRule');

    return {
      /**
       * Recognized bank transaction may belongs to uncategorized transactions.
       */
      uncategorizedTransactions: {
        relation: Model.HasManyRelation,
        modelClass: UncategorizedCashflowTransaction.default,
        join: {
          from: 'recognized_bank_transactions.uncategorizedTransactionId',
          to: 'uncategorized_cashflow_transactions.id',
        },
      },

      /**
       * Recognized bank transaction may belongs to assign account.
       */
      assignAccount: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account.default,
        join: {
          from: 'recognized_bank_transactions.assignedAccountId',
          to: 'accounts.id',
        },
      },

      /**
       * Recognized bank transaction may belongs to bank rule.
       */
      bankRule: {
        relation: Model.BelongsToOneRelation,
        modelClass: BankRule,
        join: {
          from: 'recognized_bank_transactions.bankRuleId',
          to: 'bank_rules.id',
        },
      },
    };
  }
}
