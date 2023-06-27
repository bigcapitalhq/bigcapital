import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';

@Service()
export class PaymentReceiveActivateBranches {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all credit notes transactions with the primary branch.
   * @param   {number} tenantId
   * @param   {number} primaryBranchId
   * @returns {Promise<void>}
   */
  public updatePaymentsWithBranch = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    // Updates the sale invoice with primary branch.
    await PaymentReceive.query(trx).update({ branchId: primaryBranchId });
  };
}
