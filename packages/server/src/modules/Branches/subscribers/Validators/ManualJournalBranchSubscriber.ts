
import {
  IManualJournalCreatingPayload,
  IManualJournalEditingPayload,
} from '@/modules/ManualJournals/types/ManualJournals.types';
import { ManualJournalBranchesValidator } from '../../integrations/ManualJournals/ManualJournalsBranchesValidator';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { events } from '@/common/events/events';
import { Features } from '@/common/types/Features';
import { FeaturesManager } from '../../../Features/FeaturesManager';

@Injectable()
export class ManualJournalBranchValidateSubscriber {
  constructor(
    private readonly validateManualJournalBranch: ManualJournalBranchesValidator,
    private readonly featuresManager: FeaturesManager,
  ) { }

  /**
   * Validate branch existance on estimate creating.
   * @param {IManualJournalCreatingPayload} payload
   */
  @OnEvent(events.manualJournals.onCreating)
  async validateBranchExistanceOnBillCreating({
    manualJournalDTO,
  }: IManualJournalCreatingPayload) {
    // Detarmines whether the multi-branches is accessible by tenant.
    const isAccessible = await this.featuresManager.accessible(
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
   * Validate branch existance once estimate editing.
   * @param {ISaleEstimateEditingPayload} payload
   */
  @OnEvent(events.manualJournals.onEditing)
  async validateBranchExistanceOnBillEditing({
    manualJournalDTO,
  }: IManualJournalEditingPayload) {
    // Detarmines whether the multi-branches is accessible by tenant.
    const isAccessible = await this.featuresManager.accessible(
      Features.BRANCHES
    );
    // Can't continue if the multi-branches feature is inactive.
    if (!isAccessible) return;

    await this.validateManualJournalBranch.validateEntriesHasBranchId(
      manualJournalDTO
    );
  };
}
