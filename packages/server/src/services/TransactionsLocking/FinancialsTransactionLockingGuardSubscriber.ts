import { Inject, Service } from 'typedi';
import FinancialTransactionLocking from './FinancialTransactionLockingGuard';
import events from '@/subscribers/events';
import {
  ICommandCashflowCreatingPayload,
  ICommandCashflowDeletingPayload,
  IExpenseCreatingPayload,
  IExpenseDeletingPayload,
  IExpenseEventEditingPayload,
  IInventoryAdjustmentCreatingPayload,
  IInventoryAdjustmentDeletingPayload,
  IInventoryAdjustmentPublishingPayload,
  IManualJournalCreatingPayload,
  IExpensePublishingPayload,
  IManualJournalEditingPayload,
  IManualJournalPublishingPayload,
} from '@/interfaces';

@Service()
export default class FinancialTransactionLockingGuardSubscriber {
  @Inject()
  financialTransactionsLocking: FinancialTransactionLocking;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach = (bus) => {
    // Manual journals.
    bus.subscribe(
      events.manualJournals.onCreating,
      this.transactionsLockingGuardOnManualJournalCreating
    );
    bus.subscribe(
      events.manualJournals.onEditing,
      this.transactionsLockingGuardOnManualJournalEditing
    );
    bus.subscribe(
      events.manualJournals.onDeleting,
      this.transactionsLockingGuardOnManualJournalDeleting
    );
    bus.subscribe(
      events.manualJournals.onPublishing,
      this.transactionsLockingGuardOnManualJournalPublishing
    );
    // Expenses
    bus.subscribe(
      events.expenses.onCreating,
      this.transactionsLockingGuardOnExpenseCreating
    );
    bus.subscribe(
      events.expenses.onEditing,
      this.transactionsLockingGuardOnExpenseEditing
    );
    bus.subscribe(
      events.expenses.onDeleting,
      this.transactionsLockingGuardOnExpenseDeleting
    );
    bus.subscribe(
      events.expenses.onPublishing,
      this.transactionsLockingGuardOnExpensePublishing
    );
    // Cashflow
    bus.subscribe(
      events.cashflow.onTransactionCreating,
      this.transactionsLockingGuardOnCashflowTransactionCreating
    );
    bus.subscribe(
      events.cashflow.onTransactionDeleting,
      this.transactionsLockingGuardOnCashflowTransactionDeleting
    );
    // Inventory adjustment.
    bus.subscribe(
      events.inventoryAdjustment.onQuickCreating,
      this.transactionsLockingGuardOnInventoryAdjCreating
    );
    bus.subscribe(
      events.inventoryAdjustment.onDeleting,
      this.transactionLockingGuardOnInventoryAdjDeleting
    );
    bus.subscribe(
      events.inventoryAdjustment.onPublishing,
      this.transactionLockingGuardOnInventoryAdjPublishing
    );
  };

  /**
   * ---------------------------------------------
   * - MANUAL JOURNALS SERVICE.
   * ---------------------------------------------
   */

  /**
   * Transaction locking guard on manual journal creating.
   * @param {IManualJournalCreatingPayload} payload
   */
  private transactionsLockingGuardOnManualJournalCreating = async ({
    tenantId,
    manualJournalDTO,
  }: IManualJournalCreatingPayload) => {
    // Can't continue if the new journal is not published yet.
    if (!manualJournalDTO.publish) return;

    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      manualJournalDTO.date
    );
  };

  /**
   * Transactions locking guard on manual journal deleting.
   * @param {IManualJournalEditingPayload} payload
   */
  private transactionsLockingGuardOnManualJournalDeleting = async ({
    tenantId,
    oldManualJournal,
  }: IManualJournalEditingPayload) => {
    // Can't continue if the old journal is not published.
    if (!oldManualJournal.isPublished) return;

    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldManualJournal.date
    );
  };

  /**
   * Transactions locking guard on manual journal editing.
   * @param {IManualJournalDeletingPayload} payload
   */
  private transactionsLockingGuardOnManualJournalEditing = async ({
    tenantId,
    oldManualJournal,
    manualJournalDTO,
  }: IManualJournalEditingPayload) => {
    // Can't continue if the old and new journal are not published.
    if (!oldManualJournal.isPublished && !manualJournalDTO.publish) return;
   
    // Validate the old journal date.
    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldManualJournal.date
    );
    // Validate the new journal date.
    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      manualJournalDTO.date
    );
  };

  /**
   * Transactions locking guard on manual journal publishing.
   * @param {IManualJournalPublishingPayload}
   */
  private transactionsLockingGuardOnManualJournalPublishing = async ({
    oldManualJournal,
    tenantId,
  }: IManualJournalPublishingPayload) => {
    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldManualJournal.date
    );
  };

  /**
   * ---------------------------------------------
   * - EXPENSES SERVICE.
   * ---------------------------------------------
   */

  /**
   * Transactions locking guard on expense creating.
   * @param {IExpenseCreatingPayload} payload
   */
  private transactionsLockingGuardOnExpenseCreating = async ({
    expenseDTO,
    tenantId,
  }: IExpenseCreatingPayload) => {
    // Can't continue if the new expense is not published yet.
    if (!expenseDTO.publish) return;

    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      expenseDTO.paymentDate
    );
  };

  /**
   * Transactions locking guard on expense deleting.
   * @param {IExpenseDeletingPayload} payload
   */
  private transactionsLockingGuardOnExpenseDeleting = async ({
    tenantId,
    oldExpense,
  }: IExpenseDeletingPayload) => {
    // Can't continue if expense transaction is not published.
    if (!oldExpense.isPublished) return;

    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldExpense.paymentDate
    );
  };

  /**
   * Transactions locking guard on expense editing.
   * @param {IExpenseEventEditingPayload}
   */
  private transactionsLockingGuardOnExpenseEditing = async ({
    tenantId,
    oldExpense,
    expenseDTO,
  }: IExpenseEventEditingPayload) => {
    // Can't continue if the old and new expense is not published.
    if (!oldExpense.isPublished && !expenseDTO.publish) return;

    // Validate the old expense date.
    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldExpense.paymentDate
    );
    // Validate the new expense date.
    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      expenseDTO.paymentDate
    );
  };

  /**
   * Transactions locking guard on expense publishing.
   * @param {IExpensePublishingPayload} payload -
   */
  private transactionsLockingGuardOnExpensePublishing = async ({
    tenantId,
    oldExpense,
  }: IExpensePublishingPayload) => {
    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldExpense.paymentDate
    );
  };

  /**
   * ---------------------------------------------
   * - CASHFLOW SERVICE.
   * ---------------------------------------------
   */

  /**
   * Transactions locking guard on cashflow transaction creating.
   * @param {ICommandCashflowCreatingPayload}
   */
  private transactionsLockingGuardOnCashflowTransactionCreating = async ({
    tenantId,
    newTransactionDTO,
  }: ICommandCashflowCreatingPayload) => {
    if (!newTransactionDTO.publish) return;

    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      newTransactionDTO.date
    );
  };

  /**
   * Transactions locking guard on cashflow transaction deleting.
   * @param {ICommandCashflowDeletingPayload}
   */
  private transactionsLockingGuardOnCashflowTransactionDeleting = async ({
    tenantId,
    oldCashflowTransaction,
  }: ICommandCashflowDeletingPayload) => {
    // Can't continue if the cashflow transaction is not published.
    if (!oldCashflowTransaction.isPublished) return;

    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldCashflowTransaction.date
    );
  };

  /**
   * ---------------------------------------------
   * - INVENTORY ADJUSTMENT SERVICE.
   * ---------------------------------------------
   */

  /**
   * Transactions locking guard on inventory adjustment creating.
   * @param {IInventoryAdjustmentCreatingPayload} payload -
   */
  private transactionsLockingGuardOnInventoryAdjCreating = async ({
    tenantId,
    quickAdjustmentDTO,
  }: IInventoryAdjustmentCreatingPayload) => {
    // Can't locking if the new adjustment is not published yet.
    if (!quickAdjustmentDTO.publish) return;

    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      quickAdjustmentDTO.date
    );
  };

  /**
   * Transaction locking guard on inventory adjustment deleting.
   * @param {IInventoryAdjustmentDeletingPayload} payload
   */
  private transactionLockingGuardOnInventoryAdjDeleting = async ({
    tenantId,
    oldInventoryAdjustment,
  }: IInventoryAdjustmentDeletingPayload) => {
    // Can't locking if the adjustment is published yet.
    if (!oldInventoryAdjustment.isPublished) return;

    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldInventoryAdjustment.date
    );
  };

  /**
   * Transaction locking guard on inventory adjustment publishing.
   * @param {IInventoryAdjustmentPublishingPayload} payload
   */
  private transactionLockingGuardOnInventoryAdjPublishing = async ({
    tenantId,
    oldInventoryAdjustment,
  }: IInventoryAdjustmentPublishingPayload) => {
    await this.financialTransactionsLocking.transactionLockingGuard(
      tenantId,
      oldInventoryAdjustment.date
    );
  };
}
