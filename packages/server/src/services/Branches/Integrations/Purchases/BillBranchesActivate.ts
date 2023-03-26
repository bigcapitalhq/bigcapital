import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';

@Service()
export class BillActivateBranches {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Updates all bills transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateBillsWithBranch = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    const { Bill } = this.tenancy.models(tenantId);

    // Updates the sale invoice with primary branch.
    await Bill.query(trx).update({ branchId: primaryBranchId });
  };
}
