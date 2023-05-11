import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import {
  ICreditNoteCreatedPayload,
  ICreditNoteDeletedPayload,
  ICreditNoteEditedPayload,
  ICreditNoteOpenedPayload,
} from '@/interfaces';
import CreditNoteGLEntries from './CreditNoteGLEntries';

@Service()
export default class CreditNoteGLEntriesSubscriber {
  @Inject()
  private creditNoteGLEntries: CreditNoteGLEntries;

  /**
   * Attaches events with handlers.
   * @param bus
   */
  public attach(bus) {
    bus.subscribe(
      events.creditNote.onCreated,
      this.writeGlEntriesOnceCreditNoteCreated
    );
    bus.subscribe(
      events.creditNote.onOpened,
      this.writeGLEntriesOnceCreditNoteOpened
    );
    bus.subscribe(
      events.creditNote.onEdited,
      this.editVendorCreditGLEntriesOnceEdited
    );
    bus.subscribe(
      events.creditNote.onDeleted,
      this.revertGLEntriesOnceCreditNoteDeleted
    );
  }

  /**
   * Writes the GL entries once the credit note transaction created or open.
   * @private
   * @param {ICreditNoteCreatedPayload|ICreditNoteOpenedPayload} payload -
   */
  private writeGlEntriesOnceCreditNoteCreated = async ({
    tenantId,
    creditNote,
    creditNoteId,
    trx,
  }: ICreditNoteCreatedPayload | ICreditNoteOpenedPayload) => {
    // Can't continue if the credit note is not published yet.
    if (!creditNote.isPublished) return;

    await this.creditNoteGLEntries.createVendorCreditGLEntries(
      tenantId,
      creditNoteId,
      trx
    );
  };

  /**
   * Writes the GL entries once the vendor credit transaction opened.
   * @param {ICreditNoteOpenedPayload} payload
   */
  private writeGLEntriesOnceCreditNoteOpened = async ({
    tenantId,
    creditNoteId,
    trx,
  }: ICreditNoteOpenedPayload) => {
    await this.creditNoteGLEntries.createVendorCreditGLEntries(
      tenantId,
      creditNoteId,
      trx
    );
  };

  /**
   * Reverts GL entries once credit note deleted.
   */
  private revertGLEntriesOnceCreditNoteDeleted = async ({
    tenantId,
    oldCreditNote,
    creditNoteId,
    trx,
  }: ICreditNoteDeletedPayload) => {
    // Can't continue if the credit note is not published yet.
    if (!oldCreditNote.isPublished) return;

    await this.creditNoteGLEntries.revertVendorCreditGLEntries(
      tenantId,
      creditNoteId
    );
  };

  /**
   * Edits vendor credit associated GL entries once the transaction edited.
   * @param {ICreditNoteEditedPayload} payload -
   */
  private editVendorCreditGLEntriesOnceEdited = async ({
    tenantId,
    creditNote,
    creditNoteId,
    trx,
  }: ICreditNoteEditedPayload) => {
    // Can't continue if the credit note is not published yet.
    if (!creditNote.isPublished) return;

    await this.creditNoteGLEntries.editVendorCreditGLEntries(
      tenantId,
      creditNoteId,
      trx
    );
  };
}
