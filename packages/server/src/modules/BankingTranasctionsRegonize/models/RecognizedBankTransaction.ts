import { BaseModel } from '@/models/Model';
import { Model } from 'objection';

export class RecognizedBankTransaction extends BaseModel {
  public bankRuleId!: number;
  public uncategorizedTransactionId!: number;
  public assignedCategory!: string;
  public assignedAccountId!: number;
  public assignedPayee!: string;
  public assignedMemo!: string;

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
    const {
      UncategorizedBankTransaction,
    } = require('../../BankingTransactions/models/UncategorizedBankTransaction');
    const { Account } = require('../../Accounts/models/Account.model');
    const { BankRule } = require('../../BankRules/models/BankRule');

    return {
      /**
       * Recognized bank transaction may belongs to uncategorized transactions.
       */
      uncategorizedTransactions: {
        relation: Model.HasManyRelation,
        modelClass: UncategorizedBankTransaction,
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
        modelClass: Account,
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
