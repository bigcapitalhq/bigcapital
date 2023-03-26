import Knex from 'knex';
import {
  IRefundCreditNoteDeletedPayload,
  IRefundCreditNoteDeletingPayload,
  IRefundVendorCreditDeletedPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import RefundCreditNote from './RefundCreditNote';

@Service()
export default class DeleteRefundCreditNote extends RefundCreditNote {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Retrieve the credit note graph.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @returns
   */
  public deleteCreditNoteRefund = async (
    tenantId: number,
    refundCreditId: number
  ) => {
    const { RefundCreditNote } = this.tenancy.models(tenantId);

    // Retrieve the old credit note or throw not found service error.
    const oldRefundCredit = await this.getCreditNoteRefundOrThrowError(
      tenantId,
      refundCreditId
    );
    // Triggers `onCreditNoteRefundDeleted` event.
    await this.eventPublisher.emitAsync(events.creditNote.onRefundDelete, {
      refundCreditId,
      oldRefundCredit,
      tenantId,
    } as IRefundCreditNoteDeletedPayload);

    // Deletes refund credit note transactions with associated entries.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      const eventPayload = {
        trx,
        refundCreditId,
        oldRefundCredit,
        tenantId,
      } as IRefundCreditNoteDeletedPayload | IRefundCreditNoteDeletingPayload;

      // Triggers `onCreditNoteRefundDeleting` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onRefundDeleting,
        eventPayload
      );
      // Deletes the refund credit note graph from the storage.
      await RefundCreditNote.query(trx).findById(refundCreditId).delete();

      // Triggers `onCreditNoteRefundDeleted` event.
      await this.eventPublisher.emitAsync(
        events.creditNote.onRefundDeleted,
        eventPayload as IRefundVendorCreditDeletedPayload
      );
    });
  };
}
