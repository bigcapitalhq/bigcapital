import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { BankReconciliation } from '../models/BankReconciliation';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';
import { UpdateBankReconciliationDto } from '../dtos/UpdateBankReconciliation.dto';
import { BankingReconciliationRepository } from '../queries/BankingReconciliationRepository';
import { BankReconciliationValidator } from './BankReconciliationValidator.service';
import { events } from '@/common/events/events';

@Injectable()
export class UpdateBankReconciliationService {
  constructor(
    @Inject(BankReconciliation.name)
    private readonly reconciliationModel: TenantModelProxy<
      typeof BankReconciliation
    >,

    private readonly repository: BankingReconciliationRepository,
    private readonly validator: BankReconciliationValidator,
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Updates the given reconciliation draft.
   */
  public async updateBankReconciliation(
    reconciliationId: number,
    reconciliationDTO: UpdateBankReconciliationDto,
  ): Promise<BankReconciliation> {
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const oldReconciliation = await this.repository.getReconciliationOrThrow(
        reconciliationId,
        trx,
      );

      if (!oldReconciliation.isInProgress) {
        throw new ServiceError(
          ERRORS.BANK_RECONCILIATION_NOT_IN_PROGRESS,
          'Only in-progress reconciliations can be updated.',
        );
      }

      const startDate =
        reconciliationDTO.startDate ?? oldReconciliation.startDate;
      const endDate = reconciliationDTO.endDate ?? oldReconciliation.endDate;

      await this.validator.validatePeriod({
        accountId: oldReconciliation.accountId,
        startDate,
        endDate,
        reconciliationId,
        trx,
      });

      const latestReconciled = await this.validator.getLatestReconciledBefore(
        oldReconciliation.accountId,
        startDate,
        trx,
      );

      const beginningBalance =
        latestReconciled &&
        new Date(startDate).getTime() ===
          new Date(oldReconciliation.startDate).getTime()
          ? Number(oldReconciliation.beginningBalance)
          : latestReconciled
            ? Number(latestReconciled.endingBalance ?? 0)
            : await this.repository.getLedgerBalanceBefore(
                oldReconciliation.accountId,
                startDate,
              );

      const draftTransactions =
        reconciliationDTO.transactions !== undefined
          ? reconciliationDTO.transactions.map((transaction) => ({
              referenceType: transaction.referenceType,
              referenceId: transaction.referenceId,
              index: Number(transaction.index ?? 0),
            }))
          : (oldReconciliation.draftTransactions ?? []);

      const firstStartDate = await this.repository.getFirstStartDate(
        oldReconciliation.accountId,
        startDate,
      );

      const { rows } = await this.repository.getUnreconciledTransactions({
        accountId: oldReconciliation.accountId,
        startDate,
        endDate,
        firstStartDate,
        selectedKeys: draftTransactions,
      });

      const clearedBalance =
        beginningBalance +
        rows
          .filter((row) => row.isChecked)
          .reduce((total, row) => total + (row.debit - row.credit), 0);

      const endingBalance =
        reconciliationDTO.endingBalance ?? oldReconciliation.endingBalance;

      const reconciliation = await this.reconciliationModel()
        .query(trx)
        .patchAndFetchById(reconciliationId, {
          startDate,
          endDate,
          beginningBalance,
          endingBalance,
          clearedBalance,
          difference: Number(endingBalance ?? 0) - clearedBalance,
          draftTransactions,
          notes:
            reconciliationDTO.notes !== undefined
              ? reconciliationDTO.notes
              : oldReconciliation.notes,
        });

      await this.eventEmitter.emitAsync(events.bankReconciliation.onUpdated, {
        reconciliation,
        oldReconciliation,
        trx,
      });

      return reconciliation;
    });
  }
}
