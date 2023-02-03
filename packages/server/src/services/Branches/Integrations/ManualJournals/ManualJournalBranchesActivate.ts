import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';

@Service()
export class ManualJournalsActivateBranches {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Updates all manual journals transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateManualJournalsWithBranch = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    const { ManualJournal } = this.tenancy.models(tenantId);

    // Updates the manual journal with primary branch.
    await ManualJournal.query(trx).update({ branchId: primaryBranchId });
  };
}
