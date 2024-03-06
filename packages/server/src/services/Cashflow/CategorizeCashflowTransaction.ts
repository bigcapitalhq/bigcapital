import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';
import events from '@/subscribers/events';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '../UnitOfWork';
import {
  ICashflowTransactionCategorizedPayload,
  ICashflowTransactionUncategorizingPayload,
  ICategorizeCashflowTransactioDTO,
} from '@/interfaces';
import { Knex } from 'knex';
import { transformCategorizeTransToCashflow } from './utils';
import { CommandCashflowValidator } from './CommandCasflowValidator';
import NewCashflowTransactionService from './NewCashflowTransactionService';
import { TransferAuthorizationGuaranteeDecision } from 'plaid';

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
    uncategorizedTransactionId: number,
    categorizeDTO: ICategorizeCashflowTransactioDTO
  ) {
    const { UncategorizedCashflowTransaction } = this.tenancy.models(tenantId);

    // Retrieves the uncategorized transaction or throw an error.
    const transaction = await UncategorizedCashflowTransaction.query()
      .findById(uncategorizedTransactionId)
      .throwIfNotFound();

    // Validates the transaction shouldn't be categorized before.
    this.commandValidators.validateTransactionShouldNotCategorized(transaction);

    // Validate the uncateogirzed transaction if it's deposit the transaction direction
    // should `IN` and the same thing if it's withdrawal the direction should be OUT.
    this.commandValidators.validateUncategorizeTransactionType(
      transaction,
      categorizeDTO.transactionType
    );
    // Edits the cashflow transaction under UOW env.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTransactionCategorizing` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCategorizing,
        {
          tenantId,
          trx,
        } as ICashflowTransactionUncategorizingPayload
      );
      // Transformes the categorize DTO to the cashflow transaction.
      const cashflowTransactionDTO = transformCategorizeTransToCashflow(
        transaction,
        categorizeDTO
      );
      // Creates a new cashflow transaction.
      const cashflowTransaction =
        await this.createCashflow.newCashflowTransaction(
          tenantId,
          cashflowTransactionDTO
        );
      // Updates the uncategorized transaction as categorized.
      await UncategorizedCashflowTransaction.query(trx).patchAndFetchById(
        uncategorizedTransactionId,
        {
          categorized: true,
          categorizeRefType: 'CashflowTransaction',
          categorizeRefId: cashflowTransaction.id,
        }
      );
      // Triggers `onCashflowTransactionCategorized` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCategorized,
        {
          tenantId,
          // cashflowTransaction,
          trx,
        } as ICashflowTransactionCategorizedPayload
      );
    });
  }
}
