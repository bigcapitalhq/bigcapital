import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import CashflowTransactionJournalEntries from './CashflowTransactionJournalEntries';
import {
  ICommandCashflowCreatedPayload,
  ICommandCashflowDeletedPayload,
} from '@/interfaces';
import { CashflowTransactionAutoIncrement } from './CashflowTransactionAutoIncrement';

@Service()
export default class CashflowTransactionSubscriber {
  @Inject()
  private cashflowTransactionEntries: CashflowTransactionJournalEntries;

  @Inject()
  private cashflowTransactionAutoIncrement: CashflowTransactionAutoIncrement;

  /**
   * Attaches events with handles.
   */
  public attach(bus) {
    bus.subscribe(
      events.cashflow.onTransactionCreated,
      this.writeJournalEntriesOnceTransactionCreated
    );
    bus.subscribe(
      events.cashflow.onTransactionCreated,
      this.incrementTransactionNumberOnceTransactionCreated
    );
    bus.subscribe(
      events.cashflow.onTransactionDeleted,
      this.revertGLEntriesOnceTransactionDeleted
    );
    return bus;
  }

  /**
   * Writes the journal entries once the cashflow transaction create.
   * @param {ICommandCashflowCreatedPayload} payload -
   */
  private writeJournalEntriesOnceTransactionCreated = async ({
    tenantId,
    cashflowTransaction,
    trx,
  }: ICommandCashflowCreatedPayload) => {
    // Can't write GL entries if the transaction not published yet.
    if (!cashflowTransaction.isPublished) return;

    await this.cashflowTransactionEntries.writeJournalEntries(
      tenantId,
      cashflowTransaction.id,
      trx
    );
  };

  /**
   * Increment the cashflow transaction number once the transaction created.
   * @param {ICommandCashflowCreatedPayload} payload -
   */
  private incrementTransactionNumberOnceTransactionCreated = async ({
    tenantId,
  }: ICommandCashflowCreatedPayload) => {
    this.cashflowTransactionAutoIncrement.incrementNextTransactionNumber(
      tenantId
    );
  };

  /**
   * Deletes the GL entries once the cashflow transaction deleted.
   * @param {ICommandCashflowDeletedPayload} payload -
   */
  private revertGLEntriesOnceTransactionDeleted = async ({
    tenantId,
    cashflowTransactionId,
    trx,
  }: ICommandCashflowDeletedPayload) => {
    await this.cashflowTransactionEntries.revertJournalEntries(
      tenantId,
      cashflowTransactionId,
      trx
    );
  };
}
