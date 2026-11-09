import { Knex } from 'knex';
import { CreditNote } from '@/modules/CreditNotes/models/CreditNote';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreditNoteActivateBranches {
  constructor(
    @Inject(CreditNote.name)
    private readonly creditNoteModel: TenantModelProxy<typeof CreditNote>,
  ) {}

  /**
   * Updates all creidt notes transactions with the primary branch.
   * @param {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateCreditsWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    // Updates the sale invoice with primary branch.
    await this.creditNoteModel()
      .query(trx)
      .update({ branchId: primaryBranchId });
  };
}
