import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IVendorCreditDeletedPayload,
  IVendorCreditDeletingPayload,
} from '@/modules/VendorCredit/types/VendorCredit.types';
import { ERRORS } from '../constants';
import { VendorCredit } from '../models/VendorCredit';
import { ItemEntry } from '@/modules/TransactionItemEntry/models/ItemEntry';
import { VendorCreditAppliedBill } from '../../VendorCreditsApplyBills/models/VendorCreditAppliedBill';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { RefundVendorCredit } from '../../VendorCreditsRefund/models/RefundVendorCredit';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteVendorCreditService {
  /**
   * @param {typeof VendorCredit} vendorCreditModel - The vendor credit model.
   * @param {typeof ItemEntry} itemEntryModel - The item entry model.
   * @param {EventEmitter2} eventPublisher - The event emitter service.
   * @param {UnitOfWork} uow - The unit of work service.
   * @param {typeof RefundVendorCredit} refundVendorCreditModel - The refund vendor credit model.
   * @param {typeof VendorCreditAppliedBill} vendorCreditAppliedBillModel - The vendor credit applied bill model.
   */
  constructor(
    private eventPublisher: EventEmitter2,
    private uow: UnitOfWork,

    @Inject(ItemEntry.name)
    private itemEntryModel: TenantModelProxy<typeof ItemEntry>,

    @Inject(VendorCredit.name)
    private vendorCreditModel: TenantModelProxy<typeof VendorCredit>,

    @Inject(RefundVendorCredit.name)
    private refundVendorCreditModel: TenantModelProxy<
      typeof RefundVendorCredit
    >,

    @Inject(VendorCreditAppliedBill.name)
    private vendorCreditAppliedBillModel: TenantModelProxy<
      typeof VendorCreditAppliedBill
    >,
  ) {}

  /**
   * Deletes the given vendor credit.
   * @param {number} vendorCreditId - Vendor credit id.
   */
  public deleteVendorCredit = async (
    vendorCreditId: number,
    trx?: Knex.Transaction,
  ) => {
    // Deletes the vendor credit transactions under UOW environment.
    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Validates the delete operation against the locked vendor credit row.
      const oldVendorCredit = await this.validate(vendorCreditId, trx);

      // Triggers `onVendorCreditEditing` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onDeleting, {
        oldVendorCredit,
        trx,
      } as IVendorCreditDeletingPayload);

      // Deletes the associated credit note entries.
      await this.itemEntryModel()
        .query(trx)
        .where('reference_id', vendorCreditId)
        .where('reference_type', 'VendorCredit')
        .delete();

      // Deletes the credit note transaction.
      await this.vendorCreditModel()
        .query(trx)
        .findById(vendorCreditId)
        .delete();

      // Triggers `onVendorCreditDeleted` event.
      await this.eventPublisher.emitAsync(events.vendorCredit.onDeleted, {
        vendorCreditId,
        oldVendorCredit,
        trx,
      } as IVendorCreditDeletedPayload);
    }, trx);
  };

  /**
   * Validates the delete vendor credit operation against the locked vendor
   * credit row: existence, no associated refund transactions and no
   * associated applied to bills transactions.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {Knex.Transaction} trx - Locks the vendor credit row (FOR UPDATE).
   * @returns {Promise<VendorCredit>} The locked vendor credit.
   */
  validate = async (
    vendorCreditId: number,
    trx: Knex.Transaction,
  ): Promise<VendorCredit> => {
    // Lock the vendor credit row to serialize with concurrent refund/apply operations.
    const oldVendorCredit = await this.vendorCreditModel()
      .query(trx)
      .findById(vendorCreditId)
      .forUpdate()
      .throwIfNotFound();

    // Validates vendor credit has no associate refund transactions.
    await this.validateVendorCreditHasNoRefundTransactions(vendorCreditId, trx);

    // Validates vendor credit has no associated applied to bills transactions.
    await this.validateVendorCreditHasNoApplyBillsTransactions(
      vendorCreditId,
      trx,
    );
    return oldVendorCredit;
  };

  /**
   * Validates vendor credit has no refund transactions.
   * @param {number} vendorCreditId
   * @param {Knex.Transaction} trx
   */
  private validateVendorCreditHasNoRefundTransactions = async (
    vendorCreditId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const refundCredits = await this.refundVendorCreditModel()
      .query(trx)
      .where('vendorCreditId', vendorCreditId);
    if (refundCredits.length > 0) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_HAS_REFUND_TRANSACTIONS);
    }
  };

  /**
   * Validate vendor credit has no applied transactions to bills.
   * @param {number} vendorCreditId
   * @param {Knex.Transaction} trx
   */
  private validateVendorCreditHasNoApplyBillsTransactions = async (
    vendorCreditId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const appliedTransactions = await this.vendorCreditAppliedBillModel()
      .query(trx)
      .where('vendorCreditId', vendorCreditId);
    if (appliedTransactions.length > 0) {
      throw new ServiceError(ERRORS.VENDOR_CREDIT_HAS_APPLIED_BILLS);
    }
  };
}
