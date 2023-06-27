import { IBranchesActivatedPayload } from '@/interfaces';
import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { CashflowTransactionsActivateBranches } from '../../Integrations/Cashflow/CashflowActivateBranches';

@Service()
export class CreditNoteActivateBranchesSubscriber {
  @Inject()
  private cashflowActivateBranches: CashflowTransactionsActivateBranches;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.branch.onActivated,
      this.updateCashflowWithBranchOnActivated
    );
    return bus;
  }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  private updateCashflowWithBranchOnActivated = async ({
    tenantId,
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) => {
    await this.cashflowActivateBranches.updateCashflowTransactionsWithBranch(
      tenantId,
      primaryBranch.id,
      trx
    );
  };
}
