import { castArray } from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ICashflowTransactionCategorizedPayload,
  ICashflowTransactionUncategorizingPayload,
  ICategorizeCashflowTransactioDTO,
} from '../types/BankingCategorize.types';
import {
  transformCategorizeTransToCashflow,
  validateUncategorizedTransactionsNotExcluded,
} from '../../BankingTransactions/utils';
import { CommandBankTransactionValidator } from '../../BankingTransactions/commands/CommandCasflowValidator.service';
import { CreateBankTransactionService } from '../../BankingTransactions/commands/CreateBankTransaction.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { UncategorizedBankTransaction } from '@/modules/BankingTransactions/models/UncategorizedBankTransaction';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class CategorizeCashflowTransaction {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly commandValidators: CommandBankTransactionValidator,
    private readonly createBankTransaction: CreateBankTransactionService,

    @Inject(UncategorizedBankTransaction.name)
    private readonly uncategorizedBankTransactionModel: TenantModelProxy<
      typeof UncategorizedBankTransaction
    >,
  ) {}

  /**
   * Categorize the given cashflow transaction.
   * @param {ICategorizeCashflowTransactioDTO} categorizeDTO - Categorize DTO.
   */
  public async categorize(
    uncategorizedTransactionId: number | Array<number>,
    categorizeDTO: ICategorizeCashflowTransactioDTO,
  ) {
    const uncategorizedTransactionIds = castArray(uncategorizedTransactionId);

    // Retrieves the uncategorized transaction or throw an error.
    const oldUncategorizedTransactions =
      await this.uncategorizedBankTransactionModel()
        .query()
        .whereIn('id', uncategorizedTransactionIds)
        .throwIfNotFound();

    // Validate cannot categorize excluded transaction.
    validateUncategorizedTransactionsNotExcluded(oldUncategorizedTransactions);

    // Validates the transaction shouldn't be categorized before.
    this.commandValidators.validateTransactionsShouldNotCategorized(
      oldUncategorizedTransactions,
    );
    // Validate the uncateogirzed transaction if it's deposit the transaction direction
    // should `IN` and the same thing if it's withdrawal the direction should be OUT.
    this.commandValidators.validateUncategorizeTransactionType(
      oldUncategorizedTransactions,
      categorizeDTO.transactionType,
    );
    // Edits the cashflow transaction under UOW env.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onTransactionCategorizing` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCategorizing,
        {
          // tenantId,
          oldUncategorizedTransactions,
          trx,
        } as ICashflowTransactionUncategorizingPayload,
      );
      // Transformes the categorize DTO to the cashflow transaction.
      const cashflowTransactionDTO = transformCategorizeTransToCashflow(
        oldUncategorizedTransactions,
        categorizeDTO,
      );
      // Creates a new cashflow transaction.
      const cashflowTransaction =
        await this.createBankTransaction.newCashflowTransaction(
          cashflowTransactionDTO,
        );

      // Updates the uncategorized transaction as categorized.
      await this.uncategorizedBankTransactionModel()
        .query(trx)
        .whereIn('id', uncategorizedTransactionIds)
        .patch({
          categorized: true,
          categorizeRefType: 'CashflowTransaction',
          categorizeRefId: cashflowTransaction.id,
        });
      // Fetch the new updated uncategorized transactions.
      const uncategorizedTransactions =
        await this.uncategorizedBankTransactionModel()
          .query(trx)
          .whereIn('id', uncategorizedTransactionIds);
      // Triggers `onCashflowTransactionCategorized` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCategorized,
        {
          cashflowTransaction,
          uncategorizedTransactions,
          oldUncategorizedTransactions,
          categorizeDTO,
          trx,
        } as ICashflowTransactionCategorizedPayload,
      );
    });
  }
}
