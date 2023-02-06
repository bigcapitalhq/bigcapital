import { IBranchesActivatedPayload } from '@/interfaces';
import { Service, Inject } from 'typedi';
import { CreditNoteActivateBranches } from '../../Integrations/Sales/CreditNoteBranchesActivate';
import events from '@/subscribers/events';

@Service()
export class CreditNoteActivateBranchesSubscriber {
  @Inject()
  private creditNotesActivateBranches: CreditNoteActivateBranches;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(
      events.branch.onActivated,
      this.updateCreditNoteWithBranchOnActivated
    );
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
    await this.creditNotesActivateBranches.updateCreditsWithBranch(
      tenantId,
      primaryBranch.id,
      trx
    );
  };
}
