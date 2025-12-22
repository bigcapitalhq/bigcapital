import { castArray } from 'lodash';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { PromisePool } from '@supercharge/promise-pool';
import {
  ERRORS,
  IBankTransactionMatchedEventPayload,
  IBankTransactionMatchingEventPayload,
  IMatchTransactionDTO,
} from '../types';
import { MatchTransactionsTypes } from './MatchTransactionsTypes';
import {
  sumMatchTranasctions,
  sumUncategorizedTransactions,
  validateUncategorizedTransactionsExcluded,
  validateUncategorizedTransactionsNotMatched,
} from '../_utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { MatchTransactionEntryDto } from '../dtos/MatchBankTransaction.dto';

@Injectable()
export class MatchBankTransactions {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly matchedBankTransactions: MatchTransactionsTypes,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) { }

  /**
   * Validates the match bank transactions DTO.
   * @param {number} uncategorizedTransactionId - Uncategorized transaction id.
   * @param {IMatchTransactionsDTO} matchTransactionsDTO - Match transactions DTO.
   * @returns {Promise<void>}
   */
  async validate(
    uncategorizedTransactionId: number | Array<number>,
    matchedTransactions: Array<IMatchTransactionDTO>,
  ) {
    const uncategorizedTransactionIds = castArray(uncategorizedTransactionId);

    // Validates the uncategorized transaction existance.
    const uncategorizedTransactions =
      await this.uncategorizedBankTransactionModel()
        .query()
        .whereIn('id', uncategorizedTransactionIds)
        .withGraphFetched('matchedBankTransactions')
        .throwIfNotFound();

    // Validates the uncategorized transaction is not already matched.
    validateUncategorizedTransactionsNotMatched(uncategorizedTransactions);

    // Validate the uncategorized transaction is not excluded.
    validateUncategorizedTransactionsExcluded(uncategorizedTransactions);

    // Validates the given matched transaction.
    const validateMatchedTransaction = async (matchedTransaction) => {
      const getMatchedTransactionsService =
        this.matchedBankTransactions.registry.get(
          matchedTransaction.referenceType,
        );
      if (!getMatchedTransactionsService) {
        throw new ServiceError(
          ERRORS.RESOURCE_TYPE_MATCHING_TRANSACTION_INVALID,
        );
      }
      const foundMatchedTransaction =
        await getMatchedTransactionsService.getMatchedTransaction(
          matchedTransaction.referenceId,
        );
      if (!foundMatchedTransaction) {
        throw new ServiceError(ERRORS.RESOURCE_ID_MATCHING_TRANSACTION_INVALID);
      }
      return foundMatchedTransaction;
    };
    // Matches the given transactions under promise pool concurrency controlling.
    const validatationResult = await PromisePool.withConcurrency(10)
      .for(matchedTransactions)
      .process(validateMatchedTransaction);

    if (validatationResult.errors?.length > 0) {
      const error = validatationResult.errors.map((er) => er.raw)[0];
      throw new ServiceError(error);
    }
    // Calculate the total given matching transactions.
    const totalMatchedTranasctions = sumMatchTranasctions(
      validatationResult.results,
    );
    const totalUncategorizedTransactions = sumUncategorizedTransactions(
      uncategorizedTransactions,
    );
    // Validates the total given matching transcations whether is not equal
    // uncategorized transaction amount.
    // Use tolerance-based comparison to handle floating-point precision issues
    const tolerance = 0.01; // Allow 0.01 difference for floating-point precision
    const difference = Math.abs(totalUncategorizedTransactions - totalMatchedTranasctions);
    if (difference > tolerance) {
      throw new ServiceError(ERRORS.TOTAL_MATCHING_TRANSACTIONS_INVALID);
    }
  }

  /**
   * Matches the given uncategorized transaction to the given references.
   * @param {number} uncategorizedTransactionId
   * @returns {Promise<void>}
   */
  public async matchTransaction(
    uncategorizedTransactionId: number | Array<number>,
    matchedTransactionsDto: MatchTransactionEntryDto | Array<MatchTransactionEntryDto>,
  ): Promise<void> {
    const uncategorizedTransactionIds = castArray(uncategorizedTransactionId);
    const matchedTransactions = castArray(matchedTransactionsDto);

    // Validates the given matching transactions DTO.
    await this.validate(uncategorizedTransactionIds, matchedTransactions);
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers the event `onBankTransactionMatching`.
      await this.eventPublisher.emitAsync(events.bankMatch.onMatching, {
        uncategorizedTransactionIds,
        matchedTransactions,
        trx,
      } as IBankTransactionMatchingEventPayload);

      // Matches the given transactions under promise pool concurrency controlling.
      await PromisePool.withConcurrency(10)
        .for(matchedTransactions)
        .process(async (matchedTransaction: MatchTransactionEntryDto) => {
          const getMatchedTransactionsService =
            this.matchedBankTransactions.registry.get(
              matchedTransaction.referenceType,
            );
          await getMatchedTransactionsService.createMatchedTransaction(
            uncategorizedTransactionIds,
            matchedTransaction,
            trx,
          );
        });
      // Triggers the event `onBankTransactionMatched`.
      await this.eventPublisher.emitAsync(events.bankMatch.onMatched, {
        uncategorizedTransactionIds,
        matchedTransactions,
        trx,
      } as IBankTransactionMatchedEventPayload);
    });
  }
}
