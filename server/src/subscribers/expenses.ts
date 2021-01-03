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
   * Handles the writing journal entries once the expense created.
   */
  @On(events.expenses.onCreated)
  public async onExpenseCreated({
    expenseId,
    expense,
    tenantId,
    authorizedUser,
  }) {
    // In case expense published, write journal entries.
    if (expense.publishedAt) {
      await this.expensesService.writeJournalEntries(
        tenantId,
        expense,
        authorizedUser.id,
        false
      );
    }
  }

  /**
   * Handle writing expense journal entries once the expense edited.
   */
  @On(events.expenses.onEdited)
  public async onExpenseEdited({
    expenseId,
    tenantId,
    expense,
    authorizedUser,
  }) {
    // In case expense published, write journal entries.
    if (expense.publishedAt) {
      await this.expensesService.writeJournalEntries(
        tenantId,
        expense,
        authorizedUser.id,
        true
      );
    }
  }

  /**
   * Reverts expense journal entries once the expense deleted.
   */
  @On(events.expenses.onDeleted)
  public async onExpenseDeleted({ expenseId, tenantId }) {
    await this.expensesService.revertJournalEntries(tenantId, expenseId);
  }

  /**
   * Handles writing expense journal once the expense publish.
   */
  @On(events.expenses.onPublished)
  public async onExpensePublished({
    expenseId,
    tenantId,
    expense,
    authorizedUser,
  }) {
    // In case expense published, write journal entries.
    if (expense.publishedAt) {
      await this.expensesService.writeJournalEntries(
        tenantId,
        expense,
        authorizedUser.id,
        false
      );
    }
  }

  /**
   * Handles the revert journal entries once the expenses deleted in bulk.
   */
  @On(events.expenses.onBulkDeleted)
  public async handleRevertJournalEntriesOnceDeleted({
    expensesIds,
    tenantId,
  }) {
    await this.expensesService.revertJournalEntries(tenantId, expensesIds);
  }

  /**
   * Handles writing journal entriers of the not-published expenses.
   */
  @On(events.expenses.onBulkPublished)
  public async onExpenseBulkPublished({
    expensesIds,
    tenantId,
    expenses,
    oldExpenses,
    authorizedUser,
  }) {
    // Filters the not published expenses.
    const notPublishedExpenses = this.expensesService.getNonePublishedExpenses(
      oldExpenses
    );
    // Can't continue if there is no not-published expoenses.
    if (notPublishedExpenses.length === 0) { return; }

    // Writing the journal entries of not-published expenses.
    await this.expensesService.writeJournalEntries(
      tenantId,
      notPublishedExpenses,
      authorizedUser.id,
      false
    );
  }
}
