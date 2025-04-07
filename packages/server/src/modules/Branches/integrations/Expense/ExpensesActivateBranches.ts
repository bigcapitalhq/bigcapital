import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Expense } from '@/modules/Expenses/models/Expense.model';

@Injectable()
export class ExpensesActivateBranches {
  constructor(
    @Inject(Expense.name)
    private readonly expenseModel: TenantModelProxy<typeof Expense>,
  ) {}

  /**
   * Updates all expenses transactions with the primary branch.
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateExpensesWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    // Updates the expenses with primary branch.
    await this.expenseModel().query(trx).update({ branchId: primaryBranchId });
  };
}
