import { Knex } from 'knex';
import {
  CreateUncategorizedTransactionDTO,
  IUncategorizedTransactionCreatedEventPayload,
  IUncategorizedTransactionCreatingEventPayload,
} from '../types/BankingCategorize.types';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UncategorizedBankTransaction } from '../../BankingTransactions/models/UncategorizedBankTransaction';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CreateUncategorizedTransactionService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransaction: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) {}

  /**
   * Creates an uncategorized cashflow transaction.
   * @param {CreateUncategorizedTransactionDTO} createDTO - Create uncategorized transaction DTO.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<UncategorizedBankTransaction>}
   */
  public create(
    createUncategorizedTransactionDTO: CreateUncategorizedTransactionDTO,
    trx?: Knex.Transaction,
  ) {
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionUncategorizedCreating,
        {
          createUncategorizedTransactionDTO,
          trx,
        } as IUncategorizedTransactionCreatingEventPayload,
      );

      const uncategorizedTransaction = await this.uncategorizedBankTransaction
        .query(trx)
        .insertAndFetch({
          ...createUncategorizedTransactionDTO,
        });

      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionUncategorizedCreated,
        {
          uncategorizedTransaction,
          createUncategorizedTransactionDTO,
          trx,
        } as IUncategorizedTransactionCreatedEventPayload,
      );
      return uncategorizedTransaction;
    }, trx);
  }
}
