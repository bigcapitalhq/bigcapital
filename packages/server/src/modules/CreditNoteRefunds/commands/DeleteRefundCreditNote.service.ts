import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import {
  IRefundCreditNoteDeletedPayload,
  IRefundCreditNoteDeletingPayload,
} from '../types/CreditNoteRefunds.types';
import { RefundCreditNote } from '../models/RefundCreditNote';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteRefundCreditNoteService {
  /**
   * @param {UnitOfWork} uow - Unit of work.
   * @param {EventEmitter2} eventPublisher - Event emitter.
   * @param {typeof RefundCreditNote} refundCreditNoteModel - Refund credit note model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(RefundCreditNote.name)
    private readonly refundCreditNoteModel: TenantModelProxy<
      typeof RefundCreditNote
    >,
  ) {}

  /**
   * Retrieve the credit note graph.
   * @param {number} refundCreditId - Refund credit note ID.
   * @returns {Promise<void>}
   */
  public deleteCreditNoteRefund = async (refundCreditId: number) => {
    // Retrieve the old credit note or throw not found service error.
    const oldRefundCredit = await this.refundCreditNoteModel()
      .query()
      .findById(refundCreditId)
      .throwIfNotFound();

    // Triggers `onCreditNoteRefundDeleted` event.
    await this.eventPublisher.emitAsync(events.creditNote.onRefundDelete, {
      refundCreditId,
      oldRefundCredit,
    } as IRefundCreditNoteDeletedPayload);

    // Deletes refund credit note transactions with associated entries.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const eventPayload = {
        trx,
        refundCreditId,
        oldRefundCredit,
      } as IRefundCreditNoteDeletedPayload | IRefundCreditNoteDeletingPayload;

      // Triggers `onCreditNoteRefundDeleting` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onRefundDeleting,
        eventPayload,
      );
      // Deletes the refund credit note graph from the storage.
      await this.refundCreditNoteModel()
        .query(trx)
        .findById(refundCreditId)
        .delete();

      // Triggers `onCreditNoteRefundDeleted` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onRefundDeleted,
        eventPayload as IRefundCreditNoteDeletedPayload,
      );
    });
  };
}
