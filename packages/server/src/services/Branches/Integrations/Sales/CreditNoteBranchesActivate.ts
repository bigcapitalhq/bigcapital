import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class CreditNoteActivateBranches {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Updates all creidt notes transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateCreditsWithBranch = async (tenantId: number, primaryBranchId: number, trx?: Knex.Transaction) => {
    const { CreditNote } = this.tenancy.models(tenantId);

    // Updates the sale invoice with primary branch.
    await CreditNote.query(trx).update({ branchId: primaryBranchId });
  };
}
