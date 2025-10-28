import { IBranchesActivatedPayload } from '../../Branches.types';
import { events } from '@/common/events/events';
import { Injectable } from '@nestjs/common';
import { ExpensesActivateBranches } from '../../integrations/Expense/ExpensesActivateBranches';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ExpenseActivateBranchesSubscriber {
  constructor(
    private readonly expensesActivateBranches: ExpensesActivateBranches,
  ) { }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  @OnEvent(events.branch.onActivated)
  async updateExpensesWithBranchOnActivated({
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) {
    await this.expensesActivateBranches.updateExpensesWithBranch(
      primaryBranch.id,
      trx,
    );
  }
}
