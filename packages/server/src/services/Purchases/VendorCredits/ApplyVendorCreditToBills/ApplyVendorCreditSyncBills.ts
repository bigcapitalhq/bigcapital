import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import Bluebird from 'bluebird';
import { IVendorCreditAppliedBill } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export default class ApplyVendorCreditSyncBills {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Increment bills credited amount.
   * @param {number} tenantId
   * @param {IVendorCreditAppliedBill[]} vendorCreditAppliedBills
   * @param {Knex.Transaction} trx
   */
  public incrementBillsCreditedAmount = async (
    tenantId: number,
    vendorCreditAppliedBills: IVendorCreditAppliedBill[],
    trx?: Knex.Transaction
  ) => {
    const { Bill } = this.tenancy.models(tenantId);

    await Bluebird.each(
      vendorCreditAppliedBills,
      (vendorCreditAppliedBill: IVendorCreditAppliedBill) => {
        return Bill.query(trx)
          .where('id', vendorCreditAppliedBill.billId)
          .increment('creditedAmount', vendorCreditAppliedBill.amount);
      }
    );
  };

  /**
   * Decrement bill credited amount.
   * @param {number} tenantId
   * @param {IVendorCreditAppliedBill} vendorCreditAppliedBill
   * @param {Knex.Transaction} trx
   */
  public decrementBillCreditedAmount = async (
    tenantId: number,
    vendorCreditAppliedBill: IVendorCreditAppliedBill,
    trx?: Knex.Transaction
  ) => {
    const { Bill } = this.tenancy.models(tenantId);

    await Bill.query(trx)
      .findById(vendorCreditAppliedBill.billId)
      .decrement('creditedAmount', vendorCreditAppliedBill.amount);
  };
}
