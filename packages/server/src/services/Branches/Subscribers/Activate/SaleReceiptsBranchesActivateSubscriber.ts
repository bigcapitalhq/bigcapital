import { IBranchesActivatedPayload } from '@/interfaces';
import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { SaleReceiptActivateBranches } from '../../Integrations/Sales/SaleReceiptBranchesActivate';

@Service()
export class SaleReceiptsActivateBranchesSubscriber {
  @Inject()
  private receiptsActivateBranches: SaleReceiptActivateBranches;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.branch.onActivated,
      this.updateReceiptsWithBranchOnActivated
    );
    return bus;
  }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  private updateReceiptsWithBranchOnActivated = async ({
    tenantId,
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) => {
    await this.receiptsActivateBranches.updateReceiptsWithBranch(
      tenantId,
      primaryBranch.id,
      trx
    );
  };
}
