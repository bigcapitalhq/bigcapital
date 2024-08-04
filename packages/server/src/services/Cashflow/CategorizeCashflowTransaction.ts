import { Inject, Service } from 'typedi';
import { castArray } from 'lodash';
import { Knex } from 'knex';
import HasTenancyService from '../Tenancy/TenancyService';
import events from '@/subscribers/events';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '../UnitOfWork';
import {
  ICashflowTransactionCategorizedPayload,
  ICashflowTransactionUncategorizingPayload,
  ICategorizeCashflowTransactioDTO,
} from '@/interfaces';
import {
  transformCategorizeTransToCashflow,
  validateUncategorizedTransactionsNotExcluded,
} from './utils';
import { CommandCashflowValidator } from './CommandCasflowValidator';
import NewCashflowTransactionService from './NewCashflowTransactionService';

@Service()
export class CategorizeCashflowTransaction {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private commandValidators: CommandCashflowValidator;

  @Inject()
  private createCashflow: NewCashflowTransactionService;

  /**
   * Categorize the given cashflow transaction.
   * @param {number} tenantId
   * @param {ICategorizeCashflowTransactioDTO} categorizeDTO
   */
  public async categorize(
    tenantId: number,
    uncategorizedTransactionId: number | Array<number>,
    categorizeDTO: ICategorizeCashflowTransactioDTO
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);
    const uncategorizedTransactionIds = castArray(uncategorizedTransactionId);

    // Retrieves the uncategorized transaction or throw an error.
    const oldUncategorizedTransactions =
      await UncategorizedCashflowTransaction.query()
        .whereIn('id', uncategorizedTransactionIds)
        .throwIfNotFound();

    // Validate cannot categorize excluded transaction.
    validateUncategorizedTransactionsNotExcluded(oldUncategorizedTransactions);

    // Validates the transaction shouldn't be categorized before.
    this.commandValidators.validateTransactionsShouldNotCategorized(
      oldUncategorizedTransactions
    );
    // Validate the uncateogirzed transaction if it's deposit the transaction direction
    // should `IN` and the same thing if it's withdrawal the direction should be OUT.
    this.commandValidators.validateUncategorizeTransactionType(
      oldUncategorizedTransactions,
      categorizeDTO.transactionType
    );
    // Edits the cashflow transaction under UOW env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTransactionCategorizing` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCategorizing,
        {
          tenantId,
          oldUncategorizedTransactions,
          trx,
        } as ICashflowTransactionUncategorizingPayload
      );
      // Transformes the categorize DTO to the cashflow transaction.
      const cashflowTransactionDTO = transformCategorizeTransToCashflow(
        oldUncategorizedTransactions,
        categorizeDTO
      );
      // Creates a new cashflow transaction.
      const cashflowTransaction =
        await this.createCashflow.newCashflowTransaction(
          tenantId,
          cashflowTransactionDTO
        );

      // Updates the uncategorized transaction as categorized.
      await UncategorizedCashflowTransaction.query(trx)
        .whereIn('id', uncategorizedTransactionIds)
        .patch({
          categorized: true,
          categorizeRefType: 'CashflowTransaction',
          categorizeRefId: cashflowTransaction.id,
        });
      // Fetch the new updated uncategorized transactions.
      const uncategorizedTransactions =
        await UncategorizedCashflowTransaction.query(trx).whereIn(
          'id',
          uncategorizedTransactionIds
        );
      // Triggers `onCashflowTransactionCategorized` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCategorized,
        {
          tenantId,
          cashflowTransaction,
          uncategorizedTransactions,
          oldUncategorizedTransactions,
          categorizeDTO,
          trx,
        } as ICashflowTransactionCategorizedPayload
      );
    });
  }
}
