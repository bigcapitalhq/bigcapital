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
  IBankReconciliationTransactionRow,
} from '../types/BankingReconciliation.types';
import { events } from '@/common/events/events';

/**
 * Detects MySQL/MariaDB duplicate-key errors.
 */
const isDuplicateEntryError = (error: any): boolean =>
  error?.code === 'ER_DUP_ENTRY' || error?.errno === 1062;

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
   * Completes a balanced draft and saves its cleared transaction links in the
   * same database transaction.
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
      const { endingBalance, selectedKeys, notes } = this.resolveFinishInputs(
        reconciliation,
        reconciliationDTO,
      );
      const selectedRows = await this.getSelectedRows(
        reconciliation,
        selectedKeys,
        trx,
      );
      const balances = this.calculateValidatedBalances(
        reconciliation.beginningBalance,
        endingBalance,
        selectedRows,
      );

      await this.replaceTransactionLinks(reconciliation, selectedRows, trx);
      const finishedReconciliation = await this.reconciliationModel()
        .query(trx)
        .patchAndFetchById(reconciliationId, {
          ...balances,
          status: BankReconciliationStatus.Reconciled,
          draftTransactions: null,
          reconciledAt: moment().toDate(),
          reconciledBy: this.cls.get('userId') ?? null,
          notes,
        });

      await this.eventEmitter.emitAsync(events.bankReconciliation.onFinished, {
        reconciliation: finishedReconciliation,
        trx,
      });
      return finishedReconciliation;
    });
  }

  /**
   * Applies submitted values over the saved draft and requires an in-progress
   * reconciliation with a statement ending balance.
   */
  private resolveFinishInputs(
    reconciliation: BankReconciliation,
    dto: FinishBankReconciliationDto,
  ) {
    if (!reconciliation.isInProgress) {
      throw new ServiceError(
        ERRORS.BANK_RECONCILIATION_NOT_IN_PROGRESS,
        'Only in-progress reconciliations can be completed.',
      );
    }

    const endingBalance = dto.endingBalance ?? reconciliation.endingBalance;
    if (endingBalance == null) {
      throw new ServiceError(
        ERRORS.BANK_RECONCILIATION_END_BALANCE_REQUIRED,
        'The statement ending balance is required.',
      );
    }

    const selectedKeys =
      dto.transactions !== undefined
        ? dto.transactions.map(({ referenceType, referenceId, index }) => ({
            referenceType,
            referenceId,
            index: Number(index ?? 0),
          }))
        : (reconciliation.draftTransactions ?? []);

    return {
      endingBalance,
      selectedKeys,
      notes: dto.notes !== undefined ? dto.notes : reconciliation.notes,
    };
  }

  /**
   * Checks for previously reconciled selections and loads the selected ledger
   * entries eligible for this account and statement period.
   */
  private async getSelectedRows(
    reconciliation: BankReconciliation,
    selectedKeys: IBankReconciliationTransactionKey[],
    trx: Knex.Transaction,
  ) {
    const { accountId, startDate, endDate } = reconciliation;
    await this.validator.validateTransactionsNotReconciled(
      accountId,
      selectedKeys,
      trx,
    );

    const firstStartDate = await this.repository.getFirstStartDate(
      accountId,
      startDate,
    );
    const { rows } = await this.repository.getUnreconciledTransactions({
      accountId,
      startDate,
      endDate,
      firstStartDate,
      selectedKeys,
    });
    return this.resolveSelectedRows(rows, selectedKeys);
  }

  /**
   * Matches selection keys to ledger entries and returns one row per account
   * transaction ID. Throws with all keys that fail to resolve.
   */
  private resolveSelectedRows(
    rows: IBankReconciliationTransactionRow[],
    selectedKeys: IBankReconciliationTransactionKey[],
  ) {
    const rowsByKey = new Map(rows.map((row) => [row.key, row]));
    const rowsById = new Map<number, IBankReconciliationTransactionRow>();
    const missingKeys: IBankReconciliationTransactionKey[] = [];

    for (const key of selectedKeys) {
      const rowKey = this.repository.buildTransactionKey(
        key.referenceType,
        key.referenceId,
        key.index,
      );
      const row = rowsByKey.get(rowKey);
      if (row?.accountTransactionId == null) {
        missingKeys.push(key);
      } else {
        rowsById.set(row.accountTransactionId, row);
      }
    }

    if (missingKeys.length > 0) {
      throw new ServiceError(
        ERRORS.BANK_RECONCILIATION_TRANSACTIONS_CHANGED,
        'One or more selected transactions no longer exist. Reload the reconciliation and try again.',
        { missingKeys },
      );
    }
    return Array.from(rowsById.values());
  }

  /**
   * Adds the selected entries’ net debits to the beginning balance and rejects
   * a difference from the statement ending balance that exceeds the tolerance.
   */
  private calculateValidatedBalances(
    beginningBalance: number,
    endingBalance: number,
    rows: IBankReconciliationTransactionRow[],
  ) {
    const netMovement = rows.reduce(
      (total, row) => total + ((row.debit ?? 0) - (row.credit ?? 0)),
      0,
    );
    const clearedBalance = Number(beginningBalance) + netMovement;
    const difference = Number(endingBalance) - clearedBalance;
    const balances = { endingBalance, clearedBalance, difference };

    if (Math.abs(difference) > RECONCILIATION_TOLERANCE) {
      throw new ServiceError(
        ERRORS.BANK_RECONCILIATION_DIFFERENCE_NOT_ZERO,
        'The difference between the statement ending balance and the cleared balance must be zero.',
        balances,
      );
    }
    return balances;
  }

  /**
   * Replaces the reconciliation’s links with the selected ledger entries and
   * reports a duplicate link as an already-reconciled selection.
   */
  private async replaceTransactionLinks(
    reconciliation: BankReconciliation,
    rows: IBankReconciliationTransactionRow[],
    trx: Knex.Transaction,
  ): Promise<void> {
    await this.reconciliationTransactionModel()
      .query(trx)
      .where('reconciliationId', reconciliation.id)
      .delete();

    if (!rows.length) return;

    const links = rows.map((row) => ({
      reconciliationId: reconciliation.id,
      accountId: reconciliation.accountId,
      accountTransactionId: row.accountTransactionId,
      referenceType: row.referenceType,
      referenceId: row.referenceId,
      transactionIndex: row.index,
    }));

    try {
      // Objection runs an array `insert` only on PostgreSQL ("batch insert only
      // works with Postgresql"); `insertGraph` accepts an array on every
      // database (one INSERT per row on MySQL/MariaDB).
      await this.reconciliationTransactionModel().query(trx).insertGraph(links);
    } catch (error) {
      if (isDuplicateEntryError(error)) {
        throw new ServiceError(
          ERRORS.BANK_RECONCILIATION_TRANSACTIONS_CHANGED,
          'One or more selected transactions have already been reconciled.',
        );
      }
      throw error;
    }
  }
}
