import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { SaleEstimate } from '@/modules/SaleEstimates/models/SaleEstimate';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SaleEstimateActivateBranches {
  constructor(
    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: TenantModelProxy<typeof SaleEstimate>,
  ) {}

  /**
   * Updates all sale estimates transactions with the primary branch.
   * @param {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateEstimatesWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    // Updates the sale estimates with primary branch.
    await this.saleEstimateModel()
      .query(trx)
      .update({ branchId: primaryBranchId });
  };
}
