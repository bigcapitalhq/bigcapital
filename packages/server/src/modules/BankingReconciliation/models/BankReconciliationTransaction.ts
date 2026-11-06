import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import type { BankReconciliationTransactionStatus } from '../types/BankingReconciliation.types';
import type { BankReconciliation } from './BankReconciliation';
import type { Account } from '@/modules/Accounts/models/Account.model';

export class BankReconciliationTransaction extends BaseModel {
  public reconciliationId!: number;
  public accountId!: number;
  public referenceType!: string;
  public referenceId!: number;
  public transactionIndex!: number;
  public date!: Date | string;
  public transactionType!: string | null;
  public transactionNumber!: string | null;
  public referenceNumber!: string | null;
  public note!: string | null;
  public credit!: number;
  public debit!: number;
  public currencyCode!: string | null;
  public exchangeRate!: number | null;
  public transactionStatus!: BankReconciliationTransactionStatus | null;
  public isBankFeed!: boolean;
  public uncategorizedTransactionIds!: number[] | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  public reconciliation?: BankReconciliation;
  public account?: Account;

  /**
   * Table name.
   */
  static get tableName() {
    return 'bank_reconciliation_transactions';
  }

  /**
   * JSON columns.
   */
  static get jsonAttributes() {
    return ['uncategorizedTransactionIds'];
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
    };
  }
}
