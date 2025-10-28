import { Transaction } from 'objection';
import { Inject, Injectable } from '@nestjs/common';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class RefundSyncCreditRefundedAmount {
  /**
   * @param {typeof VendorCredit} vendorCreditModel - Vendor credit model.
   */
  constructor(
    @Inject(VendorCredit.name)
    private vendorCreditModel: TenantModelProxy<typeof VendorCredit>,
  ) {}

  /**
   * Increment vendor credit refunded amount.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {number} amount - Amount.
   * @param {Transaction} trx - Objection transaction.
   */
  public incrementCreditRefundedAmount = async (
    vendorCreditId: number,
    amount: number,
    trx?: Transaction,
  ): Promise<void> => {
    await this.vendorCreditModel()
      .query(trx)
      .findById(vendorCreditId)
      .increment('refundedAmount', amount);
  };

  /**
   * Decrement vendor credit refunded amount.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {number} amount - Amount.
   * @param {Transaction} trx - Objection transaction.
   */
  public decrementCreditNoteRefundAmount = async (
    vendorCreditId: number,
    amount: number,
    trx?: Transaction,
  ): Promise<void> => {
    await this.vendorCreditModel()
      .query(trx)
      .findById(vendorCreditId)
      .decrement('refundedAmount', amount);
  };
}
