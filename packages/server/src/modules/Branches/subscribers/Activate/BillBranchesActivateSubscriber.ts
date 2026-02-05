import { IBranchesActivatedPayload } from '../../Branches.types';
import { events } from '@/common/events/events';
import { Injectable } from '@nestjs/common';
import { BillActivateBranches } from '../../integrations/Purchases/BillBranchesActivate';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class BillBranchesActivateSubscriber {
  constructor(
    private readonly billActivateBranches: BillActivateBranches,
  ) { }

  /**
   * Updates bills transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  @OnEvent(events.branch.onActivated)
  async updateBillsWithBranchOnActivated({
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) {
    await this.billActivateBranches.updateBillsWithBranch(
      primaryBranch.id,
      trx,
    );
  }
}
