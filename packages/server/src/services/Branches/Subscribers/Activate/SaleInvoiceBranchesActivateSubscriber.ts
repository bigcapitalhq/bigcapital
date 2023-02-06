import { IBranchesActivatedPayload } from '@/interfaces';
import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { SaleInvoiceActivateBranches } from '../../Integrations/Sales/SaleInvoiceBranchesActivate';

@Service()
export class SaleInvoicesActivateBranchesSubscriber {
  @Inject()
  private invoicesActivateBranches: SaleInvoiceActivateBranches;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.branch.onActivated,
      this.updateInvoicesWithBranchOnActivated
    );
    return bus;
  }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  private updateInvoicesWithBranchOnActivated = async ({
    tenantId,
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) => {
    await this.invoicesActivateBranches.updateInvoicesWithBranch(
      tenantId,
      primaryBranch.id,
      trx
    );
  };
}
