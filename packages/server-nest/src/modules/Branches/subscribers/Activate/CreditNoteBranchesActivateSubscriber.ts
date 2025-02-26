import { events } from '@/common/events/events';
import { OnEvent } from '@nestjs/event-emitter';
import { IBranchesActivatedPayload } from '../../Branches.types';
import { Injectable } from '@nestjs/common';
import { CreditNoteActivateBranches } from '../../integrations/Sales/CreditNoteBranchesActivate';

@Injectable()
export class CreditNoteActivateBranchesSubscriber {
  constructor(
    private readonly creditNotesActivateBranches: CreditNoteActivateBranches,
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
    await this.creditNotesActivateBranches.updateCreditsWithBranch(
      primaryBranch.id,
      trx
    );
  };
}
