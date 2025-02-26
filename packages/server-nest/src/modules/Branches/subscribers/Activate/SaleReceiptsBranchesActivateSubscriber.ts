import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { IBranchesActivatedPayload } from '../../Branches.types';
import { SaleReceiptActivateBranches } from '../../integrations/Sales/SaleReceiptBranchesActivate';

@Injectable()
export class SaleReceiptsActivateBranchesSubscriber {
  constructor(
    private readonly receiptsActivateBranches: SaleReceiptActivateBranches,
  ) {}

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  @OnEvent(events.branch.onActivated)
  async updateReceiptsWithBranchOnActivated({
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) {
    await this.receiptsActivateBranches.updateReceiptsWithBranch(
      primaryBranch.id,
      trx,
    );
  }
}
