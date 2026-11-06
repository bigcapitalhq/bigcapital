import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { BankReconciliation } from '../models/BankReconciliation';
import { BankReconciliationTransaction } from '../models/BankReconciliationTransaction';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';
import { BankingReconciliationRepository } from '../queries/BankingReconciliationRepository';
import { events } from '@/common/events/events';

@Injectable()
export class DeleteBankReconciliationService {
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
   * Deletes the given draft or voided reconciliation.
   */
  public async deleteBankReconciliation(
    reconciliationId: number,
  ): Promise<void> {
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const reconciliation = await this.repository.getReconciliationOrThrow(
        reconciliationId,
        trx,
      );

      if (reconciliation.isReconciled) {
        throw new ServiceError(
          ERRORS.BANK_RECONCILIATION_UNDO_FIRST,
          'Undo the reconciliation before deleting it.',
        );
      }

      await this.reconciliationTransactionModel()
        .query(trx)
        .where('reconciliationId', reconciliationId)
        .delete();

      await this.reconciliationModel()
        .query(trx)
        .findById(reconciliationId)
        .delete();

      await this.eventEmitter.emitAsync(events.bankReconciliation.onDeleted, {
        reconciliationId,
        oldReconciliation: reconciliation,
        trx,
      });
    });
  }
}
