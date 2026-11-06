import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';
import { Knex } from 'knex';
import { BankReconciliation } from '../models/BankReconciliation';
import { BankReconciliationTransaction } from '../models/BankReconciliationTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS, RECONCILIATION_TOLERANCE } from '../constants';
import { FinishBankReconciliationDto } from '../dtos/FinishBankReconciliation.dto';
import { BankingReconciliationRepository } from '../queries/BankingReconciliationRepository';
import { BankReconciliationValidator } from './BankReconciliationValidator.service';
import {
  BankReconciliationStatus,
  IBankReconciliationTransactionKey,
} from '../types/BankingReconciliation.types';
import { events } from '@/common/events/events';

const DATE_FORMAT = 'YYYY-MM-DD';

@Injectable()
export class FinishBankReconciliationService {
  constructor(
    @Inject(BankReconciliation.name)
    private readonly reconciliationModel: TenantModelProxy<
      typeof BankReconciliation
    >,

    @Inject(BankReconciliationTransaction.name)
    private readonly reconciliationTransactionModel: TenantModelProxy<
      typeof BankReconciliationTransaction
    >,

    private readonly repository: BankingReconciliationRepository,
    private readonly validator: BankReconciliationValidator,
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService,
  ) {}

  /**
   * Finishes the given reconciliation and snapshots its cleared transactions.
   */
  public async finishBankReconciliation(
    reconciliationId: number,
    reconciliationDTO: FinishBankReconciliationDto,
  ): Promise<BankReconciliation> {
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const reconciliation = await this.repository.getReconciliationOrThrow(
        reconciliationId,
        trx,
      );

      if (!reconciliation.isInProgress) {
        throw new ServiceError(
          ERRORS.BANK_RECONCILIATION_NOT_IN_PROGRESS,
          'Only in-progress reconciliations can be completed.',
        );
      }

      const endingBalance =
        reconciliationDTO.endingBalance ?? reconciliation.endingBalance;

      if (endingBalance === null || endingBalance === undefined) {
        throw new ServiceError(
          ERRORS.BANK_RECONCILIATION_END_BALANCE_REQUIRED,
          'The statement ending balance is required.',
        );
      }

      const selectedKeys: IBankReconciliationTransactionKey[] =
        reconciliationDTO.transactions !== undefined
          ? reconciliationDTO.transactions.map((transaction) => ({
              referenceType: transaction.referenceType,
              referenceId: transaction.referenceId,
              index: Number(transaction.index ?? 0),
            }))
          : (reconciliation.draftTransactions ?? []);

      await this.validator.validateTransactionsNotReconciled(
        reconciliation.accountId,
        selectedKeys,
        trx,
      );

      const firstStartDate = await this.repository.getFirstStartDate(
        reconciliation.accountId,
        reconciliation.startDate,
      );

      const { rows } = await this.repository.getUnreconciledTransactions({
        accountId: reconciliation.accountId,
        startDate: reconciliation.startDate,
        endDate: reconciliation.endDate,
        firstStartDate,
        selectedKeys,
      });

      const rowsMap = new Map(rows.map((row) => [row.key, row]));
      const missingKeys = selectedKeys.filter((key) => {
        const normalizedKey = this.repository.buildTransactionKey(
          key.referenceType,
          key.referenceId,
          key.index,
        );
        return !rowsMap.has(normalizedKey);
      });

      if (missingKeys.length > 0) {
        throw new ServiceError(
          ERRORS.BANK_RECONCILIATION_TRANSACTIONS_CHANGED,
          'One or more selected transactions no longer exist. Reload the reconciliation and try again.',
          { missingKeys },
        );
      }

      const selectedRows = selectedKeys.map((key) =>
        rowsMap.get(
          this.repository.buildTransactionKey(
            key.referenceType,
            key.referenceId,
            key.index,
          ),
        ),
      );

      const clearedBalance =
        Number(reconciliation.beginningBalance) +
        selectedRows.reduce(
          (total, row) => total + ((row?.debit ?? 0) - (row?.credit ?? 0)),
          0,
        );
      const difference = Number(endingBalance) - clearedBalance;

      if (Math.abs(difference) > RECONCILIATION_TOLERANCE) {
        throw new ServiceError(
          ERRORS.BANK_RECONCILIATION_DIFFERENCE_NOT_ZERO,
          'The difference between the statement ending balance and the cleared balance must be zero.',
          { difference, clearedBalance, endingBalance },
        );
      }

      await this.reconciliationTransactionModel()
        .query(trx)
        .where('reconciliationId', reconciliationId)
        .delete();

      const snapshots = selectedRows.filter(Boolean).map((row) => ({
        reconciliationId,
        accountId: reconciliation.accountId,
        referenceType: row.referenceType,
        referenceId: row.referenceId,
        transactionIndex: row.index,
        date: moment(row.date).format(DATE_FORMAT),
        transactionType: row.transactionType,
        transactionNumber: row.transactionNumber,
        referenceNumber: row.referenceNumber,
        note: row.note,
        credit: row.credit,
        debit: row.debit,
        currencyCode: row.currencyCode,
        exchangeRate: row.exchangeRate,
        transactionStatus: row.status,
        isBankFeed: row.isBankFeed,
        uncategorizedTransactionIds: row.uncategorizedTransactionIds,
      }));

      for (const snapshot of snapshots) {
        await this.reconciliationTransactionModel().query(trx).insert(snapshot);
      }

      const finishedReconciliation = await this.reconciliationModel()
        .query(trx)
        .patchAndFetchById(reconciliationId, {
          endingBalance,
          clearedBalance,
          difference,
          status: BankReconciliationStatus.Reconciled,
          draftTransactions: null,
          reconciledAt: moment().toDate(),
          reconciledBy: this.cls.get('userId') ?? null,
          notes:
            reconciliationDTO.notes !== undefined
              ? reconciliationDTO.notes
              : reconciliation.notes,
        });

      await this.eventEmitter.emitAsync(events.bankReconciliation.onFinished, {
        reconciliation: finishedReconciliation,
        trx,
      });

      return finishedReconciliation;
    });
  }
}
