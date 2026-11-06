import * as moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { BankReconciliation } from '../models/BankReconciliation';
import { BankReconciliationTransaction } from '../models/BankReconciliationTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';
import { UndoBankReconciliationDto } from '../dtos/UndoBankReconciliation.dto';
import { BankingReconciliationRepository } from '../queries/BankingReconciliationRepository';
import { BankReconciliationStatus } from '../types/BankingReconciliation.types';
import { events } from '@/common/events/events';

@Injectable()
export class UndoBankReconciliationService {
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
    private readonly uow: UnitOfWork,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Undoes the given reconciliation, reopening it as an in-progress draft.
   */
  public async undoBankReconciliation(
    reconciliationId: number,
    undoDTO: UndoBankReconciliationDto,
  ): Promise<BankReconciliation> {
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const reconciliation = await this.repository.getReconciliationOrThrow(
        reconciliationId,
        trx,
      );

      if (!reconciliation.isReconciled) {
        throw new ServiceError(
          ERRORS.BANK_RECONCILIATION_NOT_IN_PROGRESS,
          'Only completed reconciliations can be undone.',
        );
      }

      const laterReconciliations = await this.reconciliationModel()
        .query(trx)
        .where('accountId', reconciliation.accountId)
        .whereNot('status', BankReconciliationStatus.Voided)
        .where('endDate', '>', reconciliation.endDate)
        .orderBy('endDate', 'asc')
        .orderBy('id', 'asc');

      if (laterReconciliations.length > 0 && !undoDTO.cascade) {
        throw new ServiceError(
          ERRORS.BANK_RECONCILIATION_LATER_RECONCILIATIONS_EXIST,
          'Later reconciliations must be undone first. Confirm the cascade to continue.',
          {
            reconciliations: laterReconciliations.map((item) => ({
              id: item.id,
              startDate: moment(item.startDate).format('YYYY-MM-DD'),
              endDate: moment(item.endDate).format('YYYY-MM-DD'),
              status: item.status,
            })),
          },
        );
      }

      if (laterReconciliations.length > 0) {
        const laterIds = laterReconciliations.map((item) => item.id);
        await this.reconciliationTransactionModel()
          .query(trx)
          .whereIn('reconciliationId', laterIds)
          .delete();

        await this.reconciliationModel()
          .query(trx)
          .whereIn('id', laterIds)
          .patch({
            status: BankReconciliationStatus.Voided,
            voidedAt: moment().toDate(),
            draftTransactions: null,
          });
      }

      const transactionKeys = (reconciliation.transactions ?? []).map(
        (transaction) => ({
          referenceType: transaction.referenceType,
          referenceId: transaction.referenceId,
          index: transaction.transactionIndex,
        }),
      );

      await this.reconciliationTransactionModel()
        .query(trx)
        .where('reconciliationId', reconciliation.id)
        .delete();

      const reopened = await this.reconciliationModel()
        .query(trx)
        .patchAndFetchById(reconciliation.id, {
          status: BankReconciliationStatus.InProgress,
          draftTransactions: transactionKeys,
          reconciledAt: null,
          reconciledBy: null,
        });

      await this.eventEmitter.emitAsync(events.bankReconciliation.onUndone, {
        reconciliation: reopened,
        oldReconciliation: reconciliation,
        voidedReconciliationIds: laterReconciliations.map((item) => item.id),
        trx,
      });

      return reopened;
    });
  }
}
