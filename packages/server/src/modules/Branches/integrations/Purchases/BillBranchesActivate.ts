import { Knex } from 'knex';
import { Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Bill } from '@/modules/Bills/models/Bill';

@Injectable()
export class BillActivateBranches {
  constructor(private readonly billModel: TenantModelProxy<typeof Bill>) {}

  /**
   * Updates all bills transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateBillsWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    // Updates the sale invoice with primary branch.
    await Bill.query(trx).update({ branchId: primaryBranchId });
  };
}
