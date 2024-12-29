import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';

@Injectable()
export class ApplyVendorCreditSyncInvoicedService {
  /**
   * @param {typeof VendorCredit} vendorCreditModel - The vendor credit model.
   */
  constructor(
    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: typeof VendorCredit,
  ) {}

  /**
   * Increment vendor credit invoiced amount.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {number} amount - Amount to increment.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public incrementVendorCreditInvoicedAmount = async (
    vendorCreditId: number,
    amount: number,
    trx?: Knex.Transaction
  ) => {
    await this.vendorCreditModel.query(trx)
      .findById(vendorCreditId)
      .increment('invoicedAmount', amount);
  };

  /**
   * Decrement credit note invoiced amount.
   * @param {number} vendorCreditId - Vendor credit id.
   * @param {number} amount - Amount to decrement.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public decrementVendorCreditInvoicedAmount = async (
    vendorCreditId: number,
    amount: number,
    trx?: Knex.Transaction
  ) => {
    await this.vendorCreditModel.query(trx)
      .findById(vendorCreditId)
      .decrement('invoicedAmount', amount);
  };
}
