import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';

@Service()
export class SaleReceiptActivateBranches {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all sale receipts transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateReceiptsWithBranch = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    // Updates the sale receipt with primary branch.
    await SaleReceipt.query(trx).update({ branchId: primaryBranchId });
  };
}
