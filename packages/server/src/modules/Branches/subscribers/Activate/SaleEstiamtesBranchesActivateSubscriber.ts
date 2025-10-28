import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { IBranchesActivatedPayload } from '../../Branches.types';
import { events } from '@/common/events/events';
import { SaleEstimateActivateBranches } from '../../integrations/Sales/SaleEstimatesBranchesActivate';

@Injectable()
export class SaleEstimatesActivateBranchesSubscriber {
  constructor(
      private readonly estimatesActivateBranches: SaleEstimateActivateBranches,
    ) {}

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  @OnEvent(events.branch.onActivated)
  async updateEstimatesWithBranchOnActivated({
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) {
    await this.estimatesActivateBranches.updateEstimatesWithBranch(
      primaryBranch.id,
      trx
    );
  };
}
