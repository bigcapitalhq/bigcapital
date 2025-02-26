import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { SaleInvoice } from '@/modules/SaleInvoices/models/SaleInvoice';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class SaleInvoiceActivateBranches {
  constructor(
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
  ) {}

  /**
   * Updates all sale invoices transactions with the primary branch.
   * @param {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateInvoicesWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    // Updates the sale invoice with primary branch.
    await this.saleInvoiceModel()
      .query(trx)
      .update({ branchId: primaryBranchId });
  };
}
