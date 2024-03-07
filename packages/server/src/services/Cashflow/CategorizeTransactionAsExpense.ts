import {
  CategorizeTransactionAsExpenseDTO,
  ICashflowTransactionCategorizedPayload,
} from '@/interfaces';
import { Inject, Service } from 'typedi';
import UnitOfWork from '../UnitOfWork';
import events from '@/subscribers/events';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '../Tenancy/TenancyService';
import { Knex } from 'knex';
import { CreateExpense } from '../Expenses/CRUD/CreateExpense';

@Service()
export class CategorizeTransactionAsExpense {
  @Inject()
  private uow: UnitOfWork;

  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private eventPublisher: EventPublisher;

  @Inject()
  private createExpenseService: CreateExpense;

  /**
   * Categorize the transaction as expense transaction.
   * @param {number} tenantId
   * @param {number} cashflowTransactionId
   * @param {CategorizeTransactionAsExpenseDTO} transactionDTO
   */
  public async categorize(
    tenantId: number,
    cashflowTransactionId: number,
    transactionDTO: CategorizeTransactionAsExpenseDTO
  ) {
    const { CashflowTransaction } = this.tenancy.models(tenantId);

    const transaction = await CashflowTransaction.query()
      .findById(cashflowTransactionId)
      .throwIfNotFound();

    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onTransactionUncategorizing` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCategorizingAsExpense,
        {
          tenantId,
          trx,
        } as ICashflowTransactionCategorizedPayload
      );
      // Creates a new expense transaction.
      const expenseTransaction = await this.createExpenseService.newExpense(
        tenantId,
        {
          
        },
        1
      );
      // Updates the item on the storage and fetches the updated once.
      const cashflowTransaction = await CashflowTransaction.query(
        trx
      ).patchAndFetchById(cashflowTransactionId, {
        categorizeRefType: 'Expense',
        categorizeRefId: expenseTransaction.id,
        uncategorized: true,
      });
      // Triggers `onTransactionUncategorized` event.
      await this.eventPublisher.emitAsync(
        events.cashflow.onTransactionCategorizedAsExpense,
        {
          tenantId,
          cashflowTransaction,
          trx,
        } as ICashflowTransactionUncategorizedPayload
      );
    });
  }
}
