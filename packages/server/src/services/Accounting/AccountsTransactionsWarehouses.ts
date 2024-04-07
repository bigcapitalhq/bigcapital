import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class InventoryTransactionsWarehouses {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all accounts transctions with the priamry branch.
   * @param tenantId
   * @param primaryBranchId
   */
  public updateTransactionsWithWarehouse = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction,
  ) => {
    const { AccountTransaction } = await this.tenancy.models(tenantId);

    await AccountTransaction.query(trx).update({
      branchId: primaryBranchId,
    });
  };
}
