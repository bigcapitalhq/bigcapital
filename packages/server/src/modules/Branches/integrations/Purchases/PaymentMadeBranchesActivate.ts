import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BillPayment } from '@/modules/BillPayments/models/BillPayment';

@Injectable()
export class BillPaymentsActivateBranches {
  constructor(
    @Inject(BillPayment.name)
    private readonly billPaymentModel: TenantModelProxy<typeof BillPayment>,
  ) {}

  /**
   * Updates all bills payments transcations with the primary branch.
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updateBillPaymentsWithBranch = async (
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    // Updates the bill payments with primary branch.
    await this.billPaymentModel().query(trx).update({ branchId: primaryBranchId });
  };
}
