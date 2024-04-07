import { IBranchesActivatedPayload } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { PaymentReceiveActivateBranches } from '../../Integrations/Sales/PaymentReceiveBranchesActivate';

@Service()
export class PaymentReceiveActivateBranchesSubscriber {
  @Inject()
  private paymentsActivateBranches: PaymentReceiveActivateBranches;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.branch.onActivated, this.updateCreditNoteWithBranchOnActivated);
    return bus;
  }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  private updateCreditNoteWithBranchOnActivated = async ({
    tenantId,
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) => {
    await this.paymentsActivateBranches.updatePaymentsWithBranch(tenantId, primaryBranch.id, trx);
  };
}
