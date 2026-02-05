import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { VendorCredit } from '@/modules/VendorCredit/models/VendorCredit';

@Injectable()
export class VendorCreditActivateBranches {
  constructor(
    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: TenantModelProxy<typeof VendorCredit>,
  ) {}

  /**
   * Updates all vendor credits transcations with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateVendorCreditsWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    // Updates the vendors credits with primary branch.
    await this.vendorCreditModel()
      .query(trx)
      .update({ branchId: primaryBranchId });
  };
}
