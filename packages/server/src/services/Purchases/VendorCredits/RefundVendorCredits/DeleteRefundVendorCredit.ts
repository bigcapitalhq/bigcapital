import { Knex } from 'knex';
import {
  IRefundVendorCreditDeletedPayload,
  IRefundVendorCreditDeletePayload,
  IRefundVendorCreditDeletingPayload,
} from '@/interfaces';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import RefundVendorCredit from './RefundVendorCredit';

@Service()
export default class DeleteRefundVendorCredit extends RefundVendorCredit {
  @Inject()
  tenancy: HasTenancyService;

  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Retrieve the credit note graph.
   * @param {number} tenantId - Tenant id.
   * @param {number} creditNoteId - Credit note id.
   * @returns {Promise<void>}
   */
  public deleteRefundVendorCreditRefund = async (
    tenantId: number,
    refundCreditId: number
  ): Promise<void> => {
    const { RefundVendorCredit } = this.tenancy.models(tenantId);

    // Retrieve the old credit note or throw not found service error.
    const oldRefundCredit = await this.getRefundVendorCreditOrThrowError(
      tenantId,
      refundCreditId
    );
    // Triggers `onVendorCreditRefundDelete` event.
    await this.eventPublisher.emitAsync(events.vendorCredit.onRefundDelete, {
      refundCreditId,
      oldRefundCredit,
      tenantId,
    } as IRefundVendorCreditDeletePayload);

    // Deletes the refund vendor credit under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      const eventPayload = {
        trx,
        refundCreditId,
        oldRefundCredit,
        tenantId,
      } as IRefundVendorCreditDeletingPayload;

      // Triggers `onVendorCreditRefundDeleting` event.
      await this.eventPublisher.emitAsync(
        events.vendorCredit.onRefundDeleting,
        eventPayload
      );
      // Deletes the refund vendor credit graph from the storage.
      await RefundVendorCredit.query(trx).findById(refundCreditId).delete();

      // Triggers `onVendorCreditRefundDeleted` event.
      await this.eventPublisher.emitAsync(
        events.vendorCredit.onRefundDeleted,
        eventPayload as IRefundVendorCreditDeletedPayload
      );
    });
  };
}
