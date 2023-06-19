import Knex from 'knex';
import { Inject, Service } from 'typedi';
import UnitOfWork from '@/services/UnitOfWork';
import BaseCreditNotes from './CreditNotes';
import { ICreditNoteDeletedPayload, ICreditNoteDeletingPayload } from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import events from '@/subscribers/events';
import RefundCreditNote from './RefundCreditNote';
import { ServiceError } from '@/exceptions';
import { ERRORS } from './constants';

@Service()
export default class DeleteCreditNote extends BaseCreditNotes {
  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  @Inject()
  refundCreditNote: RefundCreditNote;

  /**
   * Deletes the given credit note transactions.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<void>}
   */
  public deleteCreditNote = async (
    tenantId: number,
    creditNoteId: number
  ): Promise<void> => {
    const { CreditNote, ItemEntry } = this.tenancy.models(tenantId);

    // Retrieve the credit note or throw not found service error.
    const oldCreditNote = await this.getCreditNoteOrThrowError(
      tenantId,
      creditNoteId
    );
    // Validate credit note has no refund transactions.
    await this.validateCreditNoteHasNoRefundTransactions(
      tenantId,
      creditNoteId
    );
    // Validate credit note has no applied invoices transactions.
    await this.validateCreditNoteHasNoApplyInvoiceTransactions(
      tenantId,
      creditNoteId
    );
    // Deletes the credit note transactions under unit-of-work transaction.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Triggers `onCreditNoteDeleting` event.
      await this.eventPublisher.emitAsync(events.creditNote.onDeleting, {
        trx,
        tenantId,
        oldCreditNote
      } as ICreditNoteDeletingPayload);

      // Deletes the associated credit note entries.
      await ItemEntry.query(trx)
        .where('reference_id', creditNoteId)
        .where('reference_type', 'CreditNote')
        .delete();

      // Deletes the credit note transaction.
      await CreditNote.query(trx).findById(creditNoteId).delete();

      // Triggers `onCreditNoteDeleted` event.
      await this.eventPublisher.emitAsync(events.creditNote.onDeleted, {
        tenantId,
        oldCreditNote,
        creditNoteId,
        trx,
      } as ICreditNoteDeletedPayload);
    });
  };

  /**
   * Validates credit note has no associated refund transactions.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns {Promise<void>}
   */
  private validateCreditNoteHasNoRefundTransactions = async (
    tenantId: number,
    creditNoteId: number
  ): Promise<void> => {
    const { RefundCreditNote } = this.tenancy.models(tenantId);

    const refundTransactions = await RefundCreditNote.query().where(
      'creditNoteId',
      creditNoteId
    );
    if (refundTransactions.length > 0) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_HAS_REFUNDS_TRANSACTIONS);
    }
  };

  /**
   * Validate credit note has no associated applied invoices transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} creditNoteId - Credit note id.
   * @returns {Promise<void>}
   */
  private validateCreditNoteHasNoApplyInvoiceTransactions = async (
    tenantId: number,
    creditNoteId: number
  ) => {
    const { CreditNoteAppliedInvoice } = this.tenancy.models(tenantId);

    const appliedTransactions = await CreditNoteAppliedInvoice.query().where(
      'creditNoteId',
      creditNoteId
    );
    if (appliedTransactions.length > 0) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_HAS_APPLIED_INVOICES);
    }
  };
}
