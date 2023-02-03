import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';

@Service()
export class SaleInvoiceActivateBranches {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Updates all sale invoices transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateInvoicesWithBranch = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Updates the sale invoice with primary branch.
    await SaleInvoice.query(trx).update({ branchId: primaryBranchId });
  };
}
