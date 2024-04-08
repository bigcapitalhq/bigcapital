import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Knex } from 'knex';
import { Inject, Service } from 'typedi';

@Service()
export class DeleteItemWarehousesQuantity {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Deletes the given item warehouses quantities.
   * @param {number} tenantId
   * @param {number} itemId
   * @param {Knex.Transaction} trx -
   */
  public deleteItemWarehousesQuantity = async (
    tenantId: number,
    itemId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    const { ItemWarehouseQuantity } = this.tenancy.models(tenantId);

    await ItemWarehouseQuantity.query(trx).where('itemId', itemId).delete();
  };
}
