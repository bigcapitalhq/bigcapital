import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ManualJournal } from '@/modules/ManualJournals/models/ManualJournal';

@Injectable()
export class ManualJournalsActivateBranches {
  constructor(
    private readonly manualJournalModel: TenantModelProxy<typeof ManualJournal>,
  ) {}

  /**
   * Updates all manual journals transactions with the primary branch.
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateManualJournalsWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    // Updates the manual journal with primary branch.
    await this.manualJournalModel()
      .query(trx)
      .update({ branchId: primaryBranchId });
  };
}
