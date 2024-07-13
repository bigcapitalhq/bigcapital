import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import UnitOfWork from '../UnitOfWork';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import {
  CreateUncategorizedTransactionDTO,
  IUncategorizedTransactionCreatedEventPayload,
  IUncategorizedTransactionCreatingEventPayload,
} from '@/interfaces';

@Service()
export class CreateUncategorizedTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  /**
   * Creates an uncategorized cashflow transaction.
   * @param {number} tenantId
   * @param {CreateUncategorizedTransactionDTO} createDTO
   */
  public create(
    tenantId: number,
    createUncategorizedTransactionDTO: CreateUncategorizedTransactionDTO,
    trx?: Knex.Transaction
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    return this.uow.withTransaction(
      tenantId,
      async (trx: Knex.Transaction) => {
        await this.eventPublisher.emitAsync(
          events.cashflow.onTransactionUncategorizedCreating,
          {
            tenantId,
            createUncategorizedTransactionDTO,
            trx,
          } as IUncategorizedTransactionCreatingEventPayload
        );

        const uncategorizedTransaction =
          await UncategorizedCashflowTransaction.query(trx).insertAndFetch({
            ...createUncategorizedTransactionDTO,
          });

        await this.eventPublisher.emitAsync(
          events.cashflow.onTransactionUncategorizedCreated,
          {
            tenantId,
            uncategorizedTransaction,
            createUncategorizedTransactionDTO,
            trx,
          } as IUncategorizedTransactionCreatedEventPayload
        );
        return uncategorizedTransaction;
      },
      trx
    );
  }
}
