import { Service, Inject } from 'typedi';
import { Knex } from 'knex';
import HasTenancyService from '@/services/Tenancy/TenancyService';

@Service()
export class InventoryTransactionsWarehouses {
  @Inject()
  tenancy: HasTenancyService;

  /**
   * Updates all accounts transctions with the primary branch.
   * @param tenantId
   * @param primaryBranchId
   */
  public updateTransactionsWithWarehouse = async (
    tenantId: number,
    primaryBranchId: number,
    trx?: Knex.Transaction
  ) => {
    const { AccountTransaction } = await this.tenancy.models(tenantId);

    await AccountTransaction.query(trx).update({
      branchId: primaryBranchId,
    });
  };
}
