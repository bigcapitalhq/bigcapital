import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import TenancyService from '@/services/Tenancy/TenancyService';
import {
  IExpenseCreatedPayload,
  IExpenseEventDeletePayload,
  IExpenseEventEditPayload,
  IExpenseEventPublishedPayload,
} from '@/interfaces';
import { ExpenseGLEntriesStorage } from './ExpenseGLEntriesStorage';

@Service()
export class ExpensesWriteGLSubscriber {
  @Inject()
  private tenancy: TenancyService;

  @Inject()
  private expenseGLEntries: ExpenseGLEntriesStorage;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(
      events.expenses.onCreated,
      this.handleWriteGLEntriesOnceCreated
    );
    bus.subscribe(
      events.expenses.onEdited,
      this.handleRewriteGLEntriesOnceEdited
    );
    bus.subscribe(
      events.expenses.onDeleted,
      this.handleRevertGLEntriesOnceDeleted
    );
    bus.subscribe(
      events.expenses.onPublished,
      this.handleWriteGLEntriesOncePublished
    );
  }

  /**
   * Handles the writing journal entries once the expense created.
   * @param {IExpenseCreatedPayload} payload -
   */
  public handleWriteGLEntriesOnceCreated = async ({
    expense,
    tenantId,
    trx,
  }: IExpenseCreatedPayload) => {
    // In case expense published, write journal entries.
    if (!expense.publishedAt) return;

    await this.expenseGLEntries.writeExpenseGLEntries(
      tenantId,
      expense.id,
      trx
    );
  };

  /**
   * Handle writing expense journal entries once the expense edited.
   * @param {IExpenseEventEditPayload} payload -
   */
  public handleRewriteGLEntriesOnceEdited = async ({
    expenseId,
    tenantId,
    expense,
    authorizedUser,
    trx,
  }: IExpenseEventEditPayload) => {
    // Cannot continue if the expense is not published.
    if (!expense.publishedAt) return;

    await this.expenseGLEntries.rewriteExpenseGLEntries(
      tenantId,
      expense.id,
      trx
    );
  };

  /**
   * Reverts expense journal entries once the expense deleted.
   * @param {IExpenseEventDeletePayload} payload -
   */
  public handleRevertGLEntriesOnceDeleted = async ({
    expenseId,
    tenantId,
    trx,
  }: IExpenseEventDeletePayload) => {
    await this.expenseGLEntries.revertExpenseGLEntries(
      tenantId,
      expenseId,
      trx
    );
  };

  /**
   * Handles writing expense journal once the expense publish.
   * @param {IExpenseEventPublishedPayload} payload -
   */
  public handleWriteGLEntriesOncePublished = async ({
    tenantId,
    expense,
    trx,
  }: IExpenseEventPublishedPayload) => {
    // In case expense published, write journal entries.
    if (!expense.publishedAt) return;

    await this.expenseGLEntries.rewriteExpenseGLEntries(
      tenantId,
      expense.id,
      trx
    );
  };
}
