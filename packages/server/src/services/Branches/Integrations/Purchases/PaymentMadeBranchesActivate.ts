import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';

@Service()
export class BillPaymentsActivateBranches {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all bills payments transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateBillPaymentsWithBranch = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    const { BillPayment } = this.tenancy.models(tenantId);

    // Updates the bill payments with primary branch.
    await BillPayment.query(trx).update({ branchId: primaryBranchId });
  };
}
