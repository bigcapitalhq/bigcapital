import { IBranchesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { SaleEstimateActivateBranches } from '../../Integrations/Sales/SaleEstimatesBranchesActivate';

@Service()
export class SaleEstimatesActivateBranchesSubscriber {
  @Inject()
  private estimatesActivateBranches: SaleEstimateActivateBranches;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.branch.onActivated, this.updateEstimatesWithBranchOnActivated);
    return bus;
  }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  private updateEstimatesWithBranchOnActivated = async ({
    tenantId,
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) => {
    await this.estimatesActivateBranches.updateEstimatesWithBranch(tenantId, primaryBranch.id, trx);
  };
}
