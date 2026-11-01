import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { SaleReceipt } from '@/modules/SaleReceipts/models/SaleReceipt';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class SaleReceiptActivateBranches {
  constructor(
    @Inject(SaleReceipt.name)
    private readonly saleReceiptModel: TenantModelProxy<typeof SaleReceipt>,
  ) {}

  /**
   * Updates all sale receipts transactions with the primary branch.
   * @param {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateReceiptsWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    // Updates the sale receipt with primary branch.
    await this.saleReceiptModel()
      .query(trx)
      .update({ branchId: primaryBranchId });
  };
}
