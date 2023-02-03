import { IBranchesActivatedPayload } from '@/interfaces';
import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import { BillPaymentsActivateBranches } from '../../Integrations/Purchases/PaymentMadeBranchesActivate';

@Service()
export class PaymentMadeActivateBranchesSubscriber {
  @Inject()
  private paymentsActivateBranches: BillPaymentsActivateBranches;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.branch.onActivated,
      this.updatePaymentsWithBranchOnActivated
    );
    return bus;
  }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  private updatePaymentsWithBranchOnActivated = async ({
    tenantId,
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) => {
    await this.paymentsActivateBranches.updateBillPaymentsWithBranch(
      tenantId,
      primaryBranch.id,
      trx
    );
  };
}
