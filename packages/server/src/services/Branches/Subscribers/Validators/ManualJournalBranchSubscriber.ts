import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import {
  Features,
  IManualJournalCreatingPayload,
  IManualJournalEditingPayload,
} from '@/interfaces';
import { ManualJournalBranchesValidator } from '../../Integrations/ManualJournals/ManualJournalsBranchesValidator';
import { FeaturesManager } from '@/services/Features/FeaturesManager';

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
    bus.subscribe(
      events.manualJournals.onCreating,
      this.validateBranchExistenceOnBillCreating
    );
    bus.subscribe(
      events.manualJournals.onEditing,
      this.validateBranchExistenceOnBillEditing
    );
    return bus;
  };

  /**
   * Validate branch existence on estimate creating.
   * @param {IManualJournalCreatingPayload} payload
   */
  private validateBranchExistenceOnBillCreating = async ({
    manualJournalDTO,
    tenantId,
  }: IManualJournalCreatingPayload) => {
    // Determines whether the multi-branches is accessible by tenant.
    const isAccessible = await this.featuresManager.accessible(
      tenantId,
      Features.BRANCHES
    );
    // Can't continue if the multi-branches feature is inactive.
    if (!isAccessible) return;

    // Validates the entries whether have branch id.
    await this.validateManualJournalBranch.validateEntriesHasBranchId(
      manualJournalDTO
    );
  };

  /**
   * Validate branch existence once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  private validateBranchExistenceOnBillEditing = async ({
    tenantId,
    manualJournalDTO,
  }: IManualJournalEditingPayload) => {
    // Determines whether the multi-branches is accessible by tenant.
    const isAccessible = await this.featuresManager.accessible(
      tenantId,
      Features.BRANCHES
    );
    // Can't continue if the multi-branches feature is inactive.
    if (!isAccessible) return;

    await this.validateManualJournalBranch.validateEntriesHasBranchId(
      manualJournalDTO
    );
  };
}
