import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClsService } from 'nestjs-cls';
import { Knex } from 'knex';
import { BankReconciliation } from '../models/BankReconciliation';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { BankingReconciliationRepository } from '../queries/BankingReconciliationRepository';
import { BankReconciliationValidator } from './BankReconciliationValidator.service';
import { CreateBankReconciliationDto } from '../dtos/CreateBankReconciliation.dto';
import { BankReconciliationStatus } from '../types/BankingReconciliation.types';
import { events } from '@/common/events/events';

@Injectable()
export class CreateBankReconciliationService {
  constructor(
    @Inject(BankReconciliation.name)
    private readonly reconciliationModel: TenantModelProxy<
      typeof BankReconciliation
    >,

    private readonly repository: BankingReconciliationRepository,
    private readonly validator: BankReconciliationValidator,
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService,
  ) {}

  /**
   * Creates a new bank reconciliation draft.
   */
  public async createBankReconciliation(
    reconciliationDTO: CreateBankReconciliationDto,
  ): Promise<BankReconciliation> {
    const account = await this.repository.getAccountOrThrow(
      reconciliationDTO.accountId,
    );

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.validator.validateNoInProgress(account.id, undefined, trx);
      await this.validator.validatePeriod({
        accountId: account.id,
        startDate: reconciliationDTO.startDate,
        endDate: reconciliationDTO.endDate,
        trx,
      });

      const latestReconciled = await this.validator.getLatestReconciledBefore(
        account.id,
        reconciliationDTO.startDate,
        trx,
      );

      const beginningBalance = latestReconciled
        ? Number(latestReconciled.endingBalance ?? 0)
        : await this.repository.getLedgerBalanceBefore(
            account.id,
            reconciliationDTO.startDate,
          );

      const firstStartDate = await this.repository.getFirstStartDate(
        account.id,
        reconciliationDTO.startDate,
      );

      const { rows } = await this.repository.getUnreconciledTransactions({
        accountId: account.id,
        startDate: reconciliationDTO.startDate,
        endDate: reconciliationDTO.endDate,
        firstStartDate,
      });

      const defaultCheckedRows = rows.filter((row) => row.isBankFeed);
      const draftTransactions = defaultCheckedRows.map((row) => ({
        referenceType: row.referenceType,
        referenceId: row.referenceId,
        index: row.index,
      }));

      const clearedBalance =
        beginningBalance +
        defaultCheckedRows.reduce(
          (total, row) => total + (row.debit - row.credit),
          0,
        );

      const reconciliation = await this.reconciliationModel()
        .query(trx)
        .insertAndFetch({
          accountId: account.id,
          startDate: reconciliationDTO.startDate,
          endDate: reconciliationDTO.endDate,
          beginningBalance,
          endingBalance: reconciliationDTO.endingBalance,
          clearedBalance,
          difference: reconciliationDTO.endingBalance - clearedBalance,
          status: BankReconciliationStatus.InProgress,
          draftTransactions,
          notes: reconciliationDTO.notes ?? null,
          createdBy: this.cls.get('userId') ?? null,
        });

      await this.eventEmitter.emitAsync(events.bankReconciliation.onCreated, {
        reconciliation,
        trx,
      });

      return reconciliation;
    });
  }
}
