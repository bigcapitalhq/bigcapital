import { castArray } from 'lodash';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';
import { PromisePool } from '@supercharge/promise-pool';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import {
  ERRORS,
  IBankTransactionMatchedEventPayload,
  IBankTransactionMatchingEventPayload,
  IMatchTransactionDTO,
} from './types';
import { MatchTransactionsTypes } from './MatchTransactionsTypes';
import { ServiceError } from '@/exceptions';
import {
  sumMatchTranasctions,
  sumUncategorizedTransactions,
  validateUncategorizedTransactionsExcluded,
  validateUncategorizedTransactionsNotMatched,
} from './_utils';

@Service()
export class MatchBankTransactions {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private matchedBankTransactions: MatchTransactionsTypes;

  /**
   * Validates the match bank transactions DTO.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   * @param {IMatchTransactionsDTO} matchTransactionsDTO
   * @returns {Promise<void>}
   */
  async validate(
    tenantId: number,
    uncategorizedTransactionId: number | Array<number>,
    matchedTransactions: Array<IMatchTransactionDTO>
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);
    const uncategorizedTransactionIds = castArray(uncategorizedTransactionId);

    // Validates the uncategorized transaction existance.
    const uncategorizedTransactions =
      await UncategorizedCashflowTransaction.query()
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
          matchedTransaction.referenceType
        );
      if (!getMatchedTransactionsService) {
        throw new ServiceError(
          ERRORS.RESOURCE_TYPE_MATCHING_TRANSACTION_INVALID
        );
      }
      const foundMatchedTransaction =
        await getMatchedTransactionsService.getMatchedTransaction(
          tenantId,
          matchedTransaction.referenceId
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
      validatationResult.results
    );
    const totalUncategorizedTransactions = sumUncategorizedTransactions(
      uncategorizedTransactions
    );
    // Validates the total given matching transcations whether is not equal
    // uncategorized transaction amount.
    if (totalUncategorizedTransactions !== totalMatchedTranasctions) {
      throw new ServiceError(ERRORS.TOTAL_MATCHING_TRANSACTIONS_INVALID);
    }
  }

  /**
   * Matches the given uncategorized transaction to the given references.
   * @param {number} tenantId
   * @param {number} uncategorizedTransactionId
   * @returns {Promise<void>}
   */
  public async matchTransaction(
    tenantId: number,
    uncategorizedTransactionId: number | Array<number>,
    matchedTransactions: Array<IMatchTransactionDTO>
  ): Promise<void> {
    const uncategorizedTransactionIds = castArray(uncategorizedTransactionId);

    // Validates the given matching transactions DTO.
    await this.validate(
      tenantId,
      uncategorizedTransactionIds,
      matchedTransactions
    );
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers the event `onBankTransactionMatching`.
      await this.eventPublisher.emitAsync(events.bankMatch.onMatching, {
        tenantId,
        uncategorizedTransactionIds,
        matchedTransactions,
        trx,
      } as IBankTransactionMatchingEventPayload);

      // Matches the given transactions under promise pool concurrency controlling.
      await PromisePool.withConcurrency(10)
        .for(matchedTransactions)
        .process(async (matchedTransaction) => {
          const getMatchedTransactionsService =
            this.matchedBankTransactions.registry.get(
              matchedTransaction.referenceType
            );
          await getMatchedTransactionsService.createMatchedTransaction(
            tenantId,
            uncategorizedTransactionIds,
            matchedTransaction,
            trx
          );
        });
      // Triggers the event `onBankTransactionMatched`.
      await this.eventPublisher.emitAsync(events.bankMatch.onMatched, {
        tenantId,
        uncategorizedTransactionIds,
        matchedTransactions,
        trx,
      } as IBankTransactionMatchedEventPayload);
    });
  }
}
