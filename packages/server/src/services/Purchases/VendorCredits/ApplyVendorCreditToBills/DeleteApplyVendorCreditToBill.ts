import { ServiceError } from '@/exceptions';
import { IVendorCreditApplyToBillDeletedPayload } from '@/interfaces';
import Knex from 'knex';
import { EventPublisher } from '@/lib/EventPublisher/EventPublisher';
import UnitOfWork from '@/services/UnitOfWork';
import events from '@/subscribers/events';
import { Service, Inject } from 'typedi';
import BaseVendorCredit from '../BaseVendorCredit';
import { ERRORS } from '../constants';

@Service()
export default class DeleteApplyVendorCreditToBill extends BaseVendorCredit {
  @Inject()
  uow: UnitOfWork;

  @Inject()
  eventPublisher: EventPublisher;

  /**
   * Delete apply vendor credit to bill transaction.
   * @param {number} tenantId
   * @param {number} appliedCreditToBillId
   * @returns {Promise<void>}
   */
  public deleteApplyVendorCreditToBills = async (
    tenantId: number,
    appliedCreditToBillId: number
  ) => {
    const { VendorCreditAppliedBill } = this.tenancy.models(tenantId);

    const oldCreditAppliedToBill =
      await VendorCreditAppliedBill.query().findById(appliedCreditToBillId);

    if (!oldCreditAppliedToBill) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_APPLY_TO_BILLS_NOT_FOUND);
    }
    // Retrieve the vendor credit or throw not found service error.
    const vendorCredit = await this.getVendorCreditOrThrowError(
      tenantId,
      oldCreditAppliedToBill.vendorCreditId
    );
    // Deletes vendor credit apply under unit-of-work environment.
    return this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Delete vendor credit applied to bill transaction.
      await VendorCreditAppliedBill.query(trx)
        .findById(appliedCreditToBillId)
        .delete();

      // Triggers `onVendorCreditApplyToInvoiceDeleted` event.
      await this.eventPublisher.emitAsync(
        events.vendorCredit.onApplyToInvoicesDeleted,
        {
          tenantId,
          vendorCredit,
          oldCreditAppliedToBill,
          trx,
        } as IVendorCreditApplyToBillDeletedPayload
      );
    });
  };
}
