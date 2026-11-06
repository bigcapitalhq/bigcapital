import { Model } from 'objection';
import { BaseModel } from '@/models/Model';
import { BankReconciliationStatus } from '../types/BankingReconciliation.types';
import type { IBankReconciliationTransactionKey } from '../types/BankingReconciliation.types';
import type { Account } from '@/modules/Accounts/models/Account.model';
import type { BankReconciliationTransaction } from './BankReconciliationTransaction';

export class BankReconciliation extends BaseModel {
  public accountId!: number;
  public startDate!: Date | string;
  public endDate!: Date | string;
  public beginningBalance!: number;
  public endingBalance!: number | null;
  public clearedBalance!: number;
  public difference!: number;
  public status!: BankReconciliationStatus;
  public draftTransactions!: IBankReconciliationTransactionKey[] | null;
  public notes!: string | null;
  public createdBy!: number | null;
  public reconciledAt!: Date | null;
  public reconciledBy!: number | null;
  public voidedAt!: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  public account?: Account;
  public transactions?: BankReconciliationTransaction[];

  /**
   * Table name.
   */
  static get tableName() {
    return 'bank_reconciliations';
  }

  /**
   * JSON columns.
   */
  static get jsonAttributes() {
    return ['draftTransactions'];
  }

  /**
   * Timestamps columns.
   */
  get timestamps() {
    return ['createdAt', 'updatedAt'];
  }

  /**
   * Virtual attributes.
   */
  static get virtualAttributes() {
    return ['isInProgress', 'isReconciled', 'isVoided'];
  }

  get isInProgress(): boolean {
    return this.status === BankReconciliationStatus.InProgress;
  }

  get isReconciled(): boolean {
    return this.status === BankReconciliationStatus.Reconciled;
  }

  get isVoided(): boolean {
    return this.status === BankReconciliationStatus.Voided;
  }

  /**
   * Relationship mapping.
   */
  static get relationMappings() {
    const { Account } = require('../../Accounts/models/Account.model');
    const {
      BankReconciliationTransaction,
    } = require('./BankReconciliationTransaction');

    return {
      account: {
        relation: Model.BelongsToOneRelation,
        modelClass: Account,
        join: {
          from: 'bank_reconciliations.accountId',
          to: 'accounts.id',
        },
      },
      transactions: {
        relation: Model.HasManyRelation,
        modelClass: BankReconciliationTransaction,
        join: {
          from: 'bank_reconciliations.id',
          to: 'bank_reconciliation_transactions.reconciliationId',
        },
        filter(query) {
          query.orderBy([
            { column: 'date', order: 'asc' },
            { column: 'id', order: 'asc' },
          ]);
        },
      },
    };
  }
}
