import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import {
  ICreditNoteDeletedPayload,
  ICreditNoteDeletingPayload,
} from '../types/CreditNotes.types';
import { ERRORS } from '../constants';
import { CreditNote } from '../models/CreditNote';
import { CreditNoteAppliedInvoice } from '../../CreditNotesApplyInvoice/models/CreditNoteAppliedInvoice';
import { RefundCreditNote as RefundCreditNoteModel } from '../../CreditNoteRefunds/models/RefundCreditNote';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { ServiceError } from '@/modules/Items/ServiceError';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteCreditNoteService {
  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {typeof CreditNote} creditNoteModel - Credit note model.
   * @param {typeof ItemEntry} itemEntryModel - Item entry model.
   * @param {typeof CreditNoteAppliedInvoice} creditNoteAppliedInvoiceModel - Credit note applied invoice model.
   * @param {typeof RefundCreditNote} refundCreditNoteModel - Refund credit note model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(CreditNote.name)
    private readonly creditNoteModel: TenantModelProxy<typeof CreditNote>,

    @Inject(ItemEntry.name)
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,

    @Inject(CreditNoteAppliedInvoice.name)
    private readonly creditNoteAppliedInvoiceModel: TenantModelProxy<
      typeof CreditNoteAppliedInvoice
    >,

    @Inject(RefundCreditNoteModel.name)
    private readonly refundCreditNoteModel: TenantModelProxy<
      typeof RefundCreditNoteModel
    >,
  ) {}

  /**
   * Deletes the given credit note transactions.
   * @param {number} creditNoteId
   * @param {Knex.Transaction} trx - Database transaction instance.
   * @returns {Promise<void>}
   */
  public async deleteCreditNote(
    creditNoteId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    // Deletes the credit note transactions under unit-of-work transaction.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the delete operation against the locked credit note row.
      const oldCreditNote = await this.validate(creditNoteId, trx);

      // Triggers `onCreditNoteDeleting` event.
      await this.eventPublisher.emitAsync(events.creditNote.onDeleting, {
        trx,
        oldCreditNote,
      } as ICreditNoteDeletingPayload);

      // Deletes the associated credit note entries.
      await this.itemEntryModel()
        .query(trx)
        .where('reference_id', creditNoteId)
        .where('reference_type', 'CreditNote')
        .delete();

      // Deletes the credit note transaction.
      await this.creditNoteModel().query(trx).findById(creditNoteId).delete();

      // Triggers `onCreditNoteDeleted` event.
      await this.eventPublisher.emitAsync(events.creditNote.onDeleted, {
        oldCreditNote,
        creditNoteId,
        trx,
      } as ICreditNoteDeletedPayload);
    }, trx);
  }

  /**
   * Validates the delete credit note operation against the locked credit note
   * row: existence, no associated refund transactions and no associated
   * applied invoices transactions.
   * @param {number} creditNoteId - Credit note id.
   * @param {Knex.Transaction} trx - Locks the credit note row (FOR UPDATE).
   * @returns {Promise<CreditNote>} The locked credit note.
   */
  async validate(
    creditNoteId: number,
    trx: Knex.Transaction,
  ): Promise<CreditNote> {
    // Lock the credit note row to serialize with concurrent refund/apply operations.
    const oldCreditNote = await this.creditNoteModel()
      .query(trx)
      .findById(creditNoteId)
      .forUpdate()
      .throwIfNotFound();

    // Validate credit note has no refund transactions.
    await this.validateCreditNoteHasNoRefundTransactions(creditNoteId, trx);

    // Validate credit note has no applied invoices transactions.
    await this.validateCreditNoteHasNoApplyInvoiceTransactions(
      creditNoteId,
      trx,
    );
    return oldCreditNote;
  }

  /**
   * Validates credit note has no associated refund transactions.
   * @param {number} creditNoteId
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  private async validateCreditNoteHasNoRefundTransactions(
    creditNoteId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const refundTransactions = await this.refundCreditNoteModel()
      .query(trx)
      .where('creditNoteId', creditNoteId);

    if (refundTransactions.length > 0) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_HAS_REFUNDS_TRANSACTIONS);
    }
  }

  /**
   * Validate credit note has no associated applied invoices transactions.
   * @param {number} creditNoteId - Credit note id.
   * @param {Knex.Transaction} trx
   * @returns {Promise<void>}
   */
  private async validateCreditNoteHasNoApplyInvoiceTransactions(
    creditNoteId: number,
    trx?: Knex.Transaction,
  ): Promise<void> {
    const appliedTransactions = await this.creditNoteAppliedInvoiceModel()
      .query(trx)
      .where('creditNoteId', creditNoteId);

    if (appliedTransactions.length > 0) {
      throw new ServiceError(ERRORS.CREDIT_NOTE_HAS_APPLIED_INVOICES);
    }
  }
}
