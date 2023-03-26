import Knex from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

@Service()
export default class RefundSyncCreditRefundedAmount {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Increment vendor credit refunded amount.
   * @param {number} tenantId - Tenant id.
   * @param {number} amount - Amount.
   * @param {Knex.Transaction} trx - Knex transaction.
   */
  public incrementCreditRefundedAmount = async (
    tenantId: number,
    vendorCreditId: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    await VendorCredit.query(trx)
      .findById(vendorCreditId)
      .increment('refundedAmount', amount);
  };

  /**
   * Decrement vendor credit refunded amount.
   * @param {number} tenantId
   * @param {number} amount
   * @param {Knex.Transaction} trx
   */
  public decrementCreditNoteRefundAmount = async (
    tenantId: number,
    vendorCreditId: number,
    amount: number,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    await VendorCredit.query(trx)
      .findById(vendorCreditId)
      .decrement('refundedAmount', amount);
  };
}
