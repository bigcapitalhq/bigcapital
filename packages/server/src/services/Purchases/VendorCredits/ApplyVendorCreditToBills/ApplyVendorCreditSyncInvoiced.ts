import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export default class ApplyVendorCreditSyncInvoiced {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Increment vendor credit invoiced amount.
   * @param {number} tenantId
   * @param {number} vendorCreditId
   * @param {number} amount
   * @param {Knex.Transaction} trx
   */
  public incrementVendorCreditInvoicedAmount = async (
    tenantId: number,
    vendorCreditId: number,
    amount: number,
    trx?: Knex.Transaction,
  ) => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    await VendorCredit.query(trx).findById(vendorCreditId).increment('invoicedAmount', amount);
  };

  /**
   * Decrement credit note invoiced amount.
   * @param {number} tenantId
   * @param {number} creditNoteId
   * @param {number} invoicesAppliedAmount
   */
  public decrementVendorCreditInvoicedAmount = async (
    tenantId: number,
    vendorCreditId: number,
    amount: number,
    trx?: Knex.Transaction,
  ) => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    await VendorCredit.query(trx).findById(vendorCreditId).decrement('invoicedAmount', amount);
  };
}
