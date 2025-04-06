import { Knex } from 'knex';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { PaymentReceived } from '@/modules/PaymentReceived/models/PaymentReceived';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SaleEstimateActivateBranches {
  constructor(
    @Inject(PaymentReceived.name)
    private readonly paymentReceivedModel: TenantModelProxy<typeof PaymentReceived>,
  ) {}

  /**
   * Updates all sale estimates transactions with the primary branch.
   * @param {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateEstimatesWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    // Updates the sale invoice with primary branch.
    await this.paymentReceivedModel().query(trx).update({ branchId: primaryBranchId });
  };
}
