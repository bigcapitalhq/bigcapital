import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import type { BankReconciliation } from './BankReconciliation';
import type { Account } from '@/modules/Accounts/models/Account.model';
import type { AccountTransaction } from '@/modules/Accounts/models/AccountTransaction.model';

/**
 * Links a reconciliation to the journal-entry line (`accounts_transactions`)
 * it cleared. The journal entry remains the single source of truth for the
 * transaction data; this row only records the reconciled relation.
 */
export class BankReconciliationTransaction extends BaseModel {
  public reconciliationId!: number;
  public accountId!: number;
  public accountTransactionId!: number;
  public referenceType!: string;
  public referenceId!: number;
  public transactionIndex!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  public reconciliation?: BankReconciliation;
  public account?: Account;
  public accountTransaction?: AccountTransaction;

  /**
   * Table name.
   */
  static get tableName() {
    return 'bank_reconciliation_transactions';
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { BankReconciliation } = require('./BankReconciliation');
    const { Account } = require('../../Accounts/models/Account.model');
    const {
      AccountTransaction,
    } = require('../../Accounts/models/AccountTransaction.model');

    return {
      reconciliation: {
        relation: Model.BelongsToOneRelation,
        modelClass: BankReconciliation,
        join: {
          from: 'bank_reconciliation_transactions.reconciliationId',
          to: 'bank_reconciliations.id',
        },
      },
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'bank_reconciliation_transactions.accountId',
          to: 'accounts.id',
        },
      },
      accountTransaction: {
        relation: Model.BelongsToOneRelation,
        modelClass: AccountTransaction,
        join: {
          from: 'bank_reconciliation_transactions.accountTransactionId',
          to: 'accounts_transactions.id',
        },
      },
    };
  }
}
