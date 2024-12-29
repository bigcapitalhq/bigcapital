import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { IRefundVendorCredit } from '../../types/VendorCredit.types';
import { VendorCredit } from '../../models/VendorCredit';

@Injectable()
export class RefundSyncVendorCreditBalance {
  constructor(
    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: typeof VendorCredit,
  ) {}

  /**
   * Increment vendor credit refunded amount.
   * @param {IRefundVendorCredit} refundCreditNote -
   * @param {Knex.Transaction} trx -
   */
  public async incrementVendorCreditRefundAmount(
    refundVendorCredit: IRefundVendorCredit,
    trx?: Knex.Transaction
  ): Promise<void> {
    await this.vendorCreditModel
      .query(trx)
      .increment('refundedAmount', refundVendorCredit.amount);
  }

  /**
   * Decrement vendor credit refunded amount.
   * @param {IRefundVendorCredit} refundCreditNote
   * @param {Knex.Transaction} trx
   */
  public async decrementVendorCreditRefundAmount(
    refundVendorCredit: IRefundVendorCredit,
    trx?: Knex.Transaction
  ): Promise<void> {
    await this.vendorCreditModel
      .query(trx)
      .decrement('refundedAmount', refundVendorCredit.amount);
  }
}
