import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import CreditNoteInventoryTransactions from './CreditNotesInventoryTransactions';
import {
  ICreditNoteCreatedPayload,
  ICreditNoteDeletedPayload,
  ICreditNoteEditedPayload,
} from '@/interfaces';

@Service()
export default class CreditNoteInventoryTransactionsSubscriber {
  @Inject()
  inventoryTransactions: CreditNoteInventoryTransactions;

  /**
   * Attaches events with publisher.
   */
  public attach(bus) {
    bus.subscribe(
      events.creditNote.onCreated,
      this.writeInventoryTranscationsOnceCreated
    );
    bus.subscribe(
      events.creditNote.onEdited,
      this.rewriteInventoryTransactionsOnceEdited
    );
    bus.subscribe(
      events.creditNote.onDeleted,
      this.revertInventoryTransactionsOnceDeleted
    );
    bus.subscribe(
      events.creditNote.onOpened,
      this.writeInventoryTranscationsOnceCreated
    );
  }

  /**
   * Writes inventory transactions once credit note created.
   * @param {ICreditNoteCreatedPayload} payload -
   * @returns {Promise<void>}
   */
  public writeInventoryTranscationsOnceCreated = async ({
    tenantId,
    creditNote,
    trx,
  }: ICreditNoteCreatedPayload) => {
    // Can't continue if the credit note is open yet.
    if (!creditNote.isOpen) return;

    await this.inventoryTransactions.createInventoryTransactions(
      tenantId,
      creditNote,
      trx
    );
  };

  /**
   * Rewrites inventory transactions once credit note edited.
   * @param {ICreditNoteEditedPayload} payload -
   * @returns {Promise<void>}
   */
  public rewriteInventoryTransactionsOnceEdited = async ({
    tenantId,
    creditNoteId,
    creditNote,
    trx,
  }: ICreditNoteEditedPayload) => {
    // Can't continue if the credit note is open yet.
    if (!creditNote.isOpen) return;

    await this.inventoryTransactions.editInventoryTransactions(
      tenantId,
      creditNoteId,
      creditNote,
      trx
    );
  };

  /**
   * Reverts inventory transactions once credit note deleted.
   * @param {ICreditNoteDeletedPayload} payload -
   */
  public revertInventoryTransactionsOnceDeleted = async ({
    tenantId,
    creditNoteId,
    oldCreditNote,
    trx,
  }: ICreditNoteDeletedPayload) => {
    // Can't continue if the credit note is open yet.
    if (!oldCreditNote.isOpen) return;

    await this.inventoryTransactions.deleteInventoryTransactions(
      tenantId,
      creditNoteId,
      trx
    );
  };
}
