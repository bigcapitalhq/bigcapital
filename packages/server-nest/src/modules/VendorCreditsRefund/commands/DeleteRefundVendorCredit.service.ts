import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import {
  IRefundVendorCreditDeletedPayload,
  IRefundVendorCreditDeletePayload,
  IRefundVendorCreditDeletingPayload,
} from '../types/VendorCreditRefund.types';
import { RefundVendorCredit } from '../models/RefundVendorCredit';
// import { RefundVendorCreditService } from './RefundVendorCredit.service';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';

@Injectable()
export class DeleteRefundVendorCreditService {
  /**
   * @param {UnitOfWork} uow - Unit of work service.
   * @param {EventEmitter2} eventPublisher - Event emitter service.
   * @param {typeof RefundVendorCredit} refundVendorCreditModel - Refund vendor credit model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,

    @Inject(RefundVendorCredit.name)
    private readonly refundVendorCreditModel: typeof RefundVendorCredit,
  ) {}

  /**
   * Deletes the refund vendor credit.
   * @param {number} refundCreditId - Refund credit id.
   * @returns {Promise<void>}
   */
  public async deleteRefundVendorCreditRefund(
    refundCreditId: number,
  ): Promise<void> {
    // Retrieve the old credit note or throw not found service error.
    const oldRefundCredit = await this.refundVendorCreditModel
      .query()
      .findById(refundCreditId)
      .throwIfNotFound();

    // Triggers `onVendorCreditRefundDelete` event.
    await this.eventPublisher.emitAsync(events.vendorCredit.onRefundDelete, {
      refundCreditId,
      oldRefundCredit,
    } as IRefundVendorCreditDeletePayload);

    // Deletes the refund vendor credit under unit-of-work environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const eventPayload = {
        trx,
        refundCreditId,
        oldRefundCredit,
      } as IRefundVendorCreditDeletingPayload;

      // Triggers `onVendorCreditRefundDeleting` event.
      await this.eventPublisher.emitAsync(
        events.vendorCredit.onRefundDeleting,
        eventPayload,
      );
      // Deletes the refund vendor credit graph from the storage.
      await this.refundVendorCreditModel
        .query(trx)
        .findById(refundCreditId)
        .delete();

      // Triggers `onVendorCreditRefundDeleted` event.
      await this.eventPublisher.emitAsync(
        events.vendorCredit.onRefundDeleted,
        eventPayload as IRefundVendorCreditDeletedPayload,
      );
    });
  }
}
