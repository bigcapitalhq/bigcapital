import { IBranchesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { ExpensesActivateBranches } from '../../Integrations/Expense/ExpensesActivateBranches';

@Service()
export class ExpenseActivateBranchesSubscriber {
  @Inject()
  private expensesActivateBranches: ExpensesActivateBranches;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.branch.onActivated, this.updateExpensesWithBranchOnActivated);
    return bus;
  }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  private updateExpensesWithBranchOnActivated = async ({ tenantId, primaryBranch, trx }: IBranchesActivatedPayload) => {
    await this.expensesActivateBranches.updateExpensesWithBranch(tenantId, primaryBranch.id, trx);
  };
}
