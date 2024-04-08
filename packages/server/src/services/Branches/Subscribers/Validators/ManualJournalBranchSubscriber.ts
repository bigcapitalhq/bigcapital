import { Features, type IManualJournalCreatingPayload, type IManualJournalEditingPayload } from '@/interfaces';
import { FeaturesManager } from '@/services/Features/FeaturesManager';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { ManualJournalBranchesValidator } from '../../Integrations/ManualJournals/ManualJournalsBranchesValidator';

@Service()
export class ManualJournalBranchValidateSubscriber {
  @Inject()
  private validateManualJournalBranch: ManualJournalBranchesValidator;

  @Inject()
  private featuresManager: FeaturesManager;

  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(events.manualJournals.onCreating, this.validateBranchExistanceOnBillCreating);
    bus.subscribe(events.manualJournals.onEditing, this.validateBranchExistanceOnBillEditing);
    return bus;
  };

  /**
   * Validate branch existance on estimate creating.
   * @param {IManualJournalCreatingPayload} payload
   */
  private validateBranchExistanceOnBillCreating = async ({
    manualJournalDTO,
    tenantId,
  }: IManualJournalCreatingPayload) => {
    // Detarmines whether the multi-branches is accessible by tenant.
    const isAccessible = await this.featuresManager.accessible(tenantId, Features.BRANCHES);
    // Can't continue if the multi-branches feature is inactive.
    if (!isAccessible) return;

    // Validates the entries whether have branch id.
    await this.validateManualJournalBranch.validateEntriesHasBranchId(manualJournalDTO);
  };

  /**
   * Validate branch existance once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistanceOnBillEditing = async ({
    tenantId,
    manualJournalDTO,
  }: IManualJournalEditingPayload) => {
    // Detarmines whether the multi-branches is accessible by tenant.
    const isAccessible = await this.featuresManager.accessible(tenantId, Features.BRANCHES);
    // Can't continue if the multi-branches feature is inactive.
    if (!isAccessible) return;

    await this.validateManualJournalBranch.validateEntriesHasBranchId(manualJournalDTO);
  };
}
