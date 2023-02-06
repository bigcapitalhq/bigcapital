import Knex from 'knex';
import { IRefundVendorCredit } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';

@Service()
export default class RefundSyncVendorCreditBalance {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Increment vendor credit refunded amount.
   * @param {number} tenantId -
   * @param {IRefundVendorCredit} refundCreditNote -
   * @param {Knex.Transaction} trx -
   */
  public incrementVendorCreditRefundAmount = async (
    tenantId: number,
    refundVendorCredit: IRefundVendorCredit,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    await VendorCredit.query(trx).increment(
      'refundedAmount',
      refundVendorCredit.amount
    );
  };

  /**
   * Decrement vendor credit refunded amount.
   * @param {number} tenantId
   * @param {IRefundVendorCredit} refundCreditNote
   * @param {Knex.Transaction} trx
   */
  public decrementVendorCreditRefundAmount = async (
    tenantId: number,
    refundVendorCredit: IRefundVendorCredit,
    trx?: Knex.Transaction
  ): Promise<void> => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    await VendorCredit.query(trx).decrement(
      'refundedAmount',
      refundVendorCredit.amount
    );
  };
}
