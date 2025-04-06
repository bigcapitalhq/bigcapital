import { events } from '@/common/events/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { IBranchesActivatedPayload } from '../../Branches.types';
import { PaymentReceiveActivateBranches } from '../../integrations/Sales/PaymentReceiveBranchesActivate';

@Injectable()
export class PaymentReceiveActivateBranchesSubscriber {
  constructor(
    private readonly paymentsActivateBranches: PaymentReceiveActivateBranches,
  ) {}

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  @OnEvent(events.branch.onActivated)
  async updateCreditNoteWithBranchOnActivated({
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) {
    await this.paymentsActivateBranches.updatePaymentsWithBranch(
      primaryBranch.id,
      trx
    );
  };
}
