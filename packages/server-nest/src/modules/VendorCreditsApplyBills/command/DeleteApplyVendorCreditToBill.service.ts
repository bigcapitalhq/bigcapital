import { Inject, Injectable } from '@nestjs/common';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceError } from '@/modules/Items/ServiceError';
import { events } from '@/common/events/events';
import { IVendorCreditApplyToBillDeletedPayload } from '../types/VendorCreditApplyBills.types';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';
import { ERRORS } from '../VendorCreditsApplyBills.constants';
import { VendorCreditAppliedBill } from '../models/VendorCreditAppliedBill';

@Injectable()
export class DeleteApplyVendorCreditToBillService {
  /**
   * @param {UnitOfWork} uow - The unit of work service.
   * @param {EventEmitter2} eventPublisher - The event emitter service.
   * @param {typeof VendorCreditAppliedBill} vendorCreditAppliedBillModel - The vendor credit applied bill model.
   * @param {typeof VendorCredit} vendorCreditModel - The vendor credit model.
   */
  constructor(
    private readonly uow: UnitOfWork,
    private readonly eventPublisher: EventEmitter2,
    private readonly vendorCreditAppliedBillModel: typeof VendorCreditAppliedBill,

    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: typeof VendorCredit,
  ) {}

  /**
   * Delete apply vendor credit to bill transaction.
   * @param {number} appliedCreditToBillId
   * @returns {Promise<void>}
   */
  public async deleteApplyVendorCreditToBills(appliedCreditToBillId: number) {
    const oldCreditAppliedToBill = await this.vendorCreditAppliedBillModel
      .query()
      .findById(appliedCreditToBillId);

    if (!oldCreditAppliedToBill) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_APPLY_TO_BILLS_NOT_FOUND);
    }
    // Retrieve the vendor credit or throw not found service error.
    const vendorCredit = await this.vendorCreditModel
      .query()
      .findById(oldCreditAppliedToBill.vendorCreditId)
      .throwIfNotFound();

    // Deletes vendor credit apply under unit-of-work environment.
    return this.uow.withTransaction(async (trx) => {
      // Delete vendor credit applied to bill transaction.
      await this.vendorCreditAppliedBillModel
        .query(trx)
        .findById(appliedCreditToBillId)
        .delete();

      // Triggers `onVendorCreditApplyToInvoiceDeleted` event.
      await this.eventPublisher.emitAsync(
        events.vendorCredit.onApplyToInvoicesDeleted,
        {
          vendorCredit,
          oldCreditAppliedToBill,
          trx,
        } as IVendorCreditApplyToBillDeletedPayload,
      );
    });
  }
}
