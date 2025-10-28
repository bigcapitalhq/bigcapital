import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { CashflowTransactionsActivateBranches } from '../../integrations/Cashflow/CashflowActivateBranches';
import { IBranchesActivatedPayload } from '../../Branches.types';
import { events } from '@/common/events/events';

@Injectable()
export class CreditNoteActivateBranchesSubscriber {
  constructor(
    private readonly cashflowActivateBranches: CashflowTransactionsActivateBranches,
  ) { }

  /**
   * Updates accounts transactions with the primary branch once
   * the multi-branches is activated.
   * @param {IBranchesActivatedPayload}
   */
  @OnEvent(events.branch.onActivated)
  async updateCashflowWithBranchOnActivated({

    primaryBranch,
    trx,
  }: IBranchesActivatedPayload) {
    await this.cashflowActivateBranches.updateCashflowTransactionsWithBranch(
      primaryBranch.id,
      trx
    );
  };
}
