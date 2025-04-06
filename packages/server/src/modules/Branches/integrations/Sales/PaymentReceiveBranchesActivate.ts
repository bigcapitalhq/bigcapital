import { PaymentReceived } from '@/modules/PaymentReceived/models/PaymentReceived';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';

@Injectable()
export class PaymentReceiveActivateBranches {
  constructor(
    private readonly paymentReceivedModel: TenantModelProxy<typeof PaymentReceived>,
  ) {}

  /**
   * Updates all creidt notes transactions with the primary branch.
   * @param {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updatePaymentsWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    // Updates the sale invoice with primary branch.
    await this.paymentReceivedModel().query(trx).update({ branchId: primaryBranchId });
  };
}
