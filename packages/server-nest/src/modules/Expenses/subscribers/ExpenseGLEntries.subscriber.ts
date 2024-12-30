import {
  IExpenseCreatedPayload,
  IExpenseEventDeletePayload,
  IExpenseEventEditPayload,
  IExpenseEventPublishedPayload,
} from '../Expenses.types';
import { ExpenseGLEntriesStorageService } from './ExpenseGLEntriesStorage.sevice';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class ExpensesWriteGLSubscriber {
  /**
   * @param {ExpenseGLEntriesStorageService} expenseGLEntries -
   */
  constructor(
    private readonly expenseGLEntries: ExpenseGLEntriesStorageService,
  ) {}

  /**
   * Handles the writing journal entries once the expense created.
   * @param {IExpenseCreatedPayload} payload -
   */
  @OnEvent(events.expenses.onCreated)
  public async handleWriteGLEntriesOnceCreated({
    expense,
    trx,
  }: IExpenseCreatedPayload) {
    // In case expense published, write journal entries.
    if (!expense.publishedAt) return;

    await this.expenseGLEntries.writeExpenseGLEntries(expense.id, trx);
  }

  /**
   * Handle writing expense journal entries once the expense edited.
   * @param {IExpenseEventEditPayload} payload -
   */
  @OnEvent(events.expenses.onEdited)
  public async handleRewriteGLEntriesOnceEdited({
    expenseId,
    expense,
    authorizedUser,
    trx,
  }: IExpenseEventEditPayload) {
    // Cannot continue if the expense is not published.
    if (!expense.publishedAt) return;

    await this.expenseGLEntries.rewriteExpenseGLEntries(expense.id, trx);
  }

  /**
   * Reverts expense journal entries once the expense deleted.
   * @param {IExpenseEventDeletePayload} payload -
   */
  @OnEvent(events.expenses.onDeleted)
  public async handleRevertGLEntriesOnceDeleted({
    expenseId,
    trx,
  }: IExpenseEventDeletePayload) {
    await this.expenseGLEntries.revertExpenseGLEntries(expenseId, trx);
  }

  /**
   * Handles writing expense journal once the expense publish.
   * @param {IExpenseEventPublishedPayload} payload -
   */
  @OnEvent(events.expenses.onPublished)
  public async handleWriteGLEntriesOncePublished({
    expense,
    trx,
  }: IExpenseEventPublishedPayload) {
    // In case expense published, write journal entries.
    if (!expense.publishedAt) return;

    await this.expenseGLEntries.rewriteExpenseGLEntries(expense.id, trx);
  }
}
