import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';

@Service()
export class VendorCreditActivateBranches {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all vendor credits transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateVendorCreditsWithBranch = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    // Updates the vendors credits with primary branch.
    await VendorCredit.query(trx).update({ branchId: primaryBranchId });
  };
}
