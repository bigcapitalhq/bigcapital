import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';
import { RefundVendorCredit } from '../models/RefundVendorCredit';

@Injectable()
export class RefundSyncVendorCreditBalance {
  constructor(
    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: typeof VendorCredit,
  ) {}

  /**
   * Increment vendor credit refunded amount.
   * @param {RefundVendorCredit} refundCreditNote -
   * @param {Knex.Transaction} trx -
   */
  public async incrementVendorCreditRefundAmount(
    refundVendorCredit: RefundVendorCredit,
    trx?: Knex.Transaction
  ): Promise<void> {
    await this.vendorCreditModel
      .query(trx)
      .increment('refundedAmount', refundVendorCredit.amount);
  }

  /**
   * Decrement vendor credit refunded amount.
   * @param {RefundVendorCredit} refundCreditNote
   * @param {Knex.Transaction} trx
   */
  public async decrementVendorCreditRefundAmount(
    refundVendorCredit: RefundVendorCredit,
    trx?: Knex.Transaction
  ): Promise<void> {
    await this.vendorCreditModel
      .query(trx)
      .decrement('refundedAmount', refundVendorCredit.amount);
  }
}
