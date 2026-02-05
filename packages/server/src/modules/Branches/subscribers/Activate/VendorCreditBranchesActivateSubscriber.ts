import { IBranchesActivatedPayload } from '../../Branches.types';
import { events } from '@/common/events/events';
import { Injectable } from '@nestjs/common';
import { VendorCreditActivateBranches } from '../../integrations/Purchases/VendorCreditBranchesActivate';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class VendorCreditBranchesActivateSubscriber {
  constructor(
    private readonly vendorCreditActivateBranches: VendorCreditActivateBranches,
  ) { }

  /**
   * Updates vendor credits transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  @OnEvent(events.branch.onActivated)
  async updateVendorCreditsWithBranchOnActivated({
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) {
    await this.vendorCreditActivateBranches.updateVendorCreditsWithBranch(
      primaryBranch.id,
      trx,
    );
  }
}
