import { events } from '@/common/events/events';
import { SaleInvoiceActivateBranches } from '../../integrations/Sales/SaleInvoiceBranchesActivate';
import { OnEvent } from '@nestjs/event-emitter';
import { IBranchesActivatedPayload } from '../../Branches.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaleInvoicesActivateBranchesSubscriber {
  constructor(
    private readonly invoicesActivateBranches: SaleInvoiceActivateBranches,
  ) { }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  @OnEvent(events.branch.onActivated)
  async updateInvoicesWithBranchOnActivated({
    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) {
    await this.invoicesActivateBranches.updateInvoicesWithBranch(
      primaryBranch.id,
      trx
    );
  };
}
