import { Knex } from 'knex';
import {
  IUncategorizedTransactionCreatedEventPayload,
  IUncategorizedTransactionCreatingEventPayload,
} from '../types/BankingCategorize.types';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UncategorizedBankTransaction } from '../../BankingTransactions/models/UncategorizedBankTransaction';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UncategorizedBankTransactionDto } from '../dtos/CreateUncategorizedBankTransaction.dto';

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
    createUncategorizedTransactionDTO: UncategorizedBankTransactionDto,
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

      let uncategorizedTransaction;
      try {
        uncategorizedTransaction = await this.uncategorizedBankTransaction()
          .query(trx)
          .insertAndFetch({
            ...createUncategorizedTransactionDTO,
          });
      } catch (error) {
        // A duplicated Plaid transaction id means the transaction was already
        // synced (e.g. by a concurrent sync run), so treat it as a no-op and
        // return the existing row to keep the sync idempotent.
        if (
          this.isDuplicatePlaidTransactionError(
            error,
            createUncategorizedTransactionDTO,
          )
        ) {
          uncategorizedTransaction = await this.uncategorizedBankTransaction()
            .query(trx)
            .findOne({
              plaidTransactionId:
                createUncategorizedTransactionDTO.plaidTransactionId,
              accountId: createUncategorizedTransactionDTO.accountId,
            })
            .throwIfNotFound();
        } else {
          throw error;
        }
      }

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

  /**
   * Determines whether the given error is a duplicate key violation on the
   * unique `plaid_transaction_id` index for the given create DTO.
   * @param {any} error - The insert error.
   * @param {UncategorizedBankTransactionDto} createDTO - Create DTO.
   * @returns {boolean}
   */
  private isDuplicatePlaidTransactionError(
    error: any,
    createDTO: UncategorizedBankTransactionDto,
  ): boolean {
    return (
      !!createDTO.plaidTransactionId &&
      error?.code === 'ER_DUP_ENTRY' &&
      error?.errno === 1062
    );
  }
}
