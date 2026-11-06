import { Inject, Injectable } from '@nestjs/common';
import * as A from 'fp-ts/Array';
import * as F from 'fp-ts/function';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BranchesSettingsService } from '@/modules/Branches/BranchesSettings';
import { Branch } from '@/modules/Branches/models/Branch.model';
import { assocItemEntriesDefaultIndex } from '@/utils/associate-item-entries-index';
import { transformManualJournalEntry } from '@/modules/ManualJournals/commands/transformManualJournalEntry';
import { CommandRecurringJournalDto } from '../dtos/RecurringJournal.dto';
import { RecurringJournal } from '../models/RecurringJournal';
import { RecurringJournalStatus } from '../RecurringJournal.types';

@Injectable()
export class RecurringJournalDTOTransformer {
  constructor(
    private readonly tenancyContext: TenancyContext,
    private readonly branchesSettings: BranchesSettingsService,

    @Inject(Branch.name)
    private readonly branchModel: TenantModelProxy<typeof Branch>,
  ) {}

  /**
   * Transforms the create/edit DTO into a recurring journal model object.
   */
  public async transformDTOToModel(
    recurringJournalDTO: CommandRecurringJournalDto,
    nextJournalDate: string | null,
    status: RecurringJournalStatus = RecurringJournalStatus.Active,
  ): Promise<RecurringJournal> {
    const tenant = await this.tenancyContext.getTenant(true);
    const authorizedUser = await this.tenancyContext.getSystemUser();

    const entries = F.pipe(
      recurringJournalDTO.entries,
      A.map(transformManualJournalEntry),
      assocItemEntriesDefaultIndex,
    );
    const branchId = await this.resolveBranchId(recurringJournalDTO.branchId);

    // Keep the entry branch aligned with the profile branch so generated
    // ledger entries are attributed to the right branch.
    const entriesWithBranch = entries.map((entry) => ({
      ...entry,
      branchId: entry.branchId ?? branchId,
    }));

    return {
      profileName: recurringJournalDTO.profileName,
      reference: recurringJournalDTO.reference ?? null,
      description: recurringJournalDTO.description ?? null,
      journalType: recurringJournalDTO.journalType || 'Journal',
      basis: recurringJournalDTO.basis ?? null,

      currencyCode:
        recurringJournalDTO.currencyCode || tenant?.metadata?.baseCurrency,
      exchangeRate: recurringJournalDTO.exchangeRate || 1,

      branchId: branchId ?? null,
      userId: authorizedUser.id,

      status,
      frequency: recurringJournalDTO.frequency,
      repeatInterval: recurringJournalDTO.repeatInterval || 1,

      startDate: recurringJournalDTO.startDate,
      endDate: recurringJournalDTO.endDate ?? null,
      maxOccurrences: recurringJournalDTO.maxOccurrences ?? null,
      occurrencesCount: 0,

      nextJournalDate,
      lastJournalDate: null,

      autoPublish: recurringJournalDTO.autoPublish ?? false,

      failureCount: 0,
      lastError: null,

      entries: entriesWithBranch,
    } as unknown as RecurringJournal;
  }

  /**
   * Resolves the profile branch, defaulting to the primary branch when the
   * multi-branch feature is enabled.
   */
  private async resolveBranchId(
    branchId?: number,
  ): Promise<number | undefined> {
    if (branchId) {
      return branchId;
    }
    const isBranchesActive =
      await this.branchesSettings.isMultiBranchesActive();

    if (!isBranchesActive) {
      return undefined;
    }
    const primaryBranch = await this.branchModel()
      .query()
      .modify('isPrimary')
      .first();
    const branch =
      primaryBranch ??
      (await this.branchModel().query().orderBy('id', 'ASC').first());

    return branch?.id;
  }
}
