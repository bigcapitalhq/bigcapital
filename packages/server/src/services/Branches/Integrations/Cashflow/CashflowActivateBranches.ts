import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class CashflowTransactionsActivateBranches {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Updates all cashflow transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateCashflowTransactionsWithBranch = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    const { CashflowTransaction } = this.tenancy.models(tenantId);

    // Updates the cashflow transactions with primary branch.
    await CashflowTransaction.query(trx).update({ branchId: primaryBranchId });
  };
}
