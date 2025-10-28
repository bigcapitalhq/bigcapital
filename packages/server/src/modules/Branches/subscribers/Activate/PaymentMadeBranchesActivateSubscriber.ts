import { BillPaymentsActivateBranches } from '../../integrations/Purchases/PaymentMadeBranchesActivate';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { IBranchesActivatedPayload } from '../../Branches.types';

@Injectable()
export class PaymentMadeActivateBranchesSubscriber {
  constructor(
    private readonly paymentsActivateBranches: BillPaymentsActivateBranches,
  ) { }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  @OnEvent(events.branch.onActivated)
  async updatePaymentsWithBranchOnActivated({
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) {
    await this.paymentsActivateBranches.updateBillPaymentsWithBranch(
      primaryBranch.id,
      trx,
    );
  }
}
