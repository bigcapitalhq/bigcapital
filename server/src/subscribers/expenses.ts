import { Container, Inject, Service } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import ExpensesService from 'services/Expenses/ExpensesService';
import TenancyService from 'services/Tenancy/TenancyService';
import ExpenseRepository from 'repositories/ExpenseRepository';

@EventSubscriber()
export default class ExpensesSubscriber {
  tenancy: TenancyService;
  expensesService: ExpensesService;

  constructor() {
    this.tenancy = Container.get(TenancyService);
    this.expensesService = Container.get(ExpensesService);
  }

  /**
   * On expense created.
   */
  @On(events.expenses.onCreated)
  public async onExpenseCreated({ expenseId, tenantId }) {
    const { expenseRepository } = this.tenancy.repositories(tenantId);
    const expense = await expenseRepository.getById(expenseId);
 
    // In case expense published, write journal entries.
    if (expense.publishedAt) {
      await this.expensesService.writeJournalEntries(tenantId, expense, false);
    }
  }
  
  /**
   * On expense edited.
   */
  @On(events.expenses.onEdited)
  public async onExpenseEdited({ expenseId, tenantId }) {
    const { expenseRepository } = this.tenancy.repositories(tenantId);
    const expense = await expenseRepository.getById(expenseId);

    // In case expense published, write journal entries.
    if (expense.publishedAt) {
      await this.expensesService.writeJournalEntries(tenantId, expense, true);
    }
  }

  /**
   * 
   * @param param0 
   */
  @On(events.expenses.onDeleted)
  public async onExpenseDeleted({ expenseId, tenantId }) {
    await this.expensesService.revertJournalEntries(tenantId, expenseId);
  }

  /**
   * 
   * @param param0 
   */
  @On(events.expenses.onPublished)
  public async onExpensePublished({ expenseId, tenantId }) {
    const { expenseRepository } = this.tenancy.repositories(tenantId);
    const expense = await expenseRepository.getById(expenseId);
 
    // In case expense published, write journal entries.
    if (expense.publishedAt) {
      await this.expensesService.writeJournalEntries(tenantId, expense, false);
    }
  }

  /**
   * 
   * @param param0 
   */
  @On(events.expenses.onBulkDeleted)
  public onExpenseBulkDeleted({ expensesIds, tenantId }) {

  }

  /**
   * 
   * @param param0 
   */
  @On(events.expenses.onBulkPublished)
  public onExpenseBulkPublished({ expensesIds, tenantId }) {

  }
}