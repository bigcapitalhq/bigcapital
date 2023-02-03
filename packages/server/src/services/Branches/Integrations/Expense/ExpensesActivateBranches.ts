import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class ExpensesActivateBranches {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Updates all expenses transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateExpensesWithBranch = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    const { Expense } = this.tenancy.models(tenantId);

    // Updates the expenses with primary branch.
    await Expense.query(trx).update({ branchId: primaryBranchId });
  };
}
