import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { BankReconciliation } from '../models/BankReconciliation';
import { BankReconciliationTransaction } from '../models/BankReconciliationTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';
import { BankReconciliationStatus } from '../types/BankingReconciliation.types';
import { IBankReconciliationTransactionKey } from '../types/BankingReconciliation.types';

const DATE_FORMAT = 'YYYY-MM-DD';

@Injectable()
export class BankReconciliationValidator {
  constructor(
    @Inject(BankReconciliation.name)
    private readonly reconciliationModel: TenantModelProxy<
      typeof BankReconciliation
    >,

    @Inject(BankReconciliationTransaction.name)
    private readonly reconciliationTransactionModel: TenantModelProxy<
      typeof BankReconciliationTransaction
    >,
  ) {}

  /**
   * Ensures the account has no other in-progress reconciliation.
   */
  public validateNoInProgress = async (
    accountId: number,
    excludeId?: number,
    trx?: Knex.Transaction,
  ) => {
    const query = this.reconciliationModel()
      .query(trx)
      .where('accountId', accountId)
      .where('status', BankReconciliationStatus.InProgress);

    if (excludeId) {
      query.whereNot('id', excludeId);
    }
    const found = await query.first();

    if (found) {
      throw new ServiceError(
        ERRORS.BANK_RECONCILIATION_ALREADY_IN_PROGRESS,
        'There is already an in-progress reconciliation for this account.',
        { reconciliationId: found.id },
      );
    }
  };

  /**
   * Retrieves the latest completed reconciliation before the given date.
   */
  public getLatestReconciledBefore = async (
    accountId: number,
    startDate: Date | string,
    trx?: Knex.Transaction,
  ): Promise<BankReconciliation | undefined> => {
    return this.reconciliationModel()
      .query(trx)
      .where('accountId', accountId)
      .where('status', BankReconciliationStatus.Reconciled)
      .where('endDate', '<', moment(startDate).format(DATE_FORMAT))
      .orderBy('endDate', 'desc')
      .orderBy('id', 'desc')
      .first();
  };

  /**
   * Validates the reconciliation period.
   */
  public validatePeriod = async (params: {
    accountId: number;
    startDate: Date | string;
    endDate: Date | string;
    reconciliationId?: number;
    trx?: Knex.Transaction;
  }) => {
    const { accountId, startDate, endDate, reconciliationId, trx } = params;

    if (moment(startDate).isAfter(moment(endDate), 'day')) {
      throw new ServiceError(
        ERRORS.BANK_RECONCILIATION_PERIOD_INVALID,
        'The reconciliation start date must be before the end date.',
      );
    }

    const overlapQuery = this.reconciliationModel()
      .query(trx)
      .where('accountId', accountId)
      .whereNot('status', BankReconciliationStatus.Voided)
      .where('startDate', '<=', moment(endDate).format(DATE_FORMAT))
      .where('endDate', '>=', moment(startDate).format(DATE_FORMAT));

    if (reconciliationId) {
      overlapQuery.whereNot('id', reconciliationId);
    }
    const overlap = await overlapQuery.first();

    if (overlap) {
      throw new ServiceError(
        ERRORS.BANK_RECONCILIATION_PERIOD_OVERLAPS,
        'The reconciliation period overlaps an existing reconciliation.',
        { reconciliationId: overlap.id },
      );
    }

    const latest = await this.getLatestReconciledBefore(
      accountId,
      startDate,
      trx,
    );

    if (latest) {
      const requiredStartDate = moment(latest.endDate)
        .add(1, 'day')
        .format(DATE_FORMAT);

      if (moment(startDate).format(DATE_FORMAT) !== requiredStartDate) {
        throw new ServiceError(
          ERRORS.BANK_RECONCILIATION_PERIOD_INVALID,
          'The reconciliation must start the day after the previous reconciliation.',
          { requiredStartDate },
        );
      }
    }
  };

  /**
   * Ensures none of the given transaction keys is already reconciled.
   */
  public validateTransactionsNotReconciled = async (
    accountId: number,
    keys: IBankReconciliationTransactionKey[],
    trx?: Knex.Transaction,
  ) => {
    if (!keys.length) return;

    const found = await this.reconciliationTransactionModel()
      .query(trx)
      .where('accountId', accountId)
      .whereIn(
        ['referenceType', 'referenceId'],
        keys.map((key) => [key.referenceType, key.referenceId]) as any,
      );

    const foundKeys = new Set(
      found.map(
        (row) =>
          `${row.referenceType}:${row.referenceId}:${row.transactionIndex}`,
      ),
    );
    const duplicate = keys.find((key) =>
      foundKeys.has(
        `${key.referenceType}:${key.referenceId}:${Number(key.index ?? 0)}`,
      ),
    );

    if (duplicate) {
      throw new ServiceError(
        ERRORS.BANK_RECONCILIATION_TRANSACTIONS_CHANGED,
        'One or more selected transactions have already been reconciled.',
        { transaction: duplicate },
      );
    }
  };
}
