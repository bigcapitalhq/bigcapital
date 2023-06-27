import { Service, Inject } from 'typedi';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { GetItemWarehouseTransformer } from './GetItemWarehouseTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetItemWarehouses {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves the item warehouses.
   * @param {number} tenantId
   * @param {number} itemId
   * @returns
   */
  public getItemWarehouses = async (tenantId: number, itemId: number) => {
    const { ItemWarehouseQuantity, Item } = this.tenancy.models(tenantId);

    // Retrieves specific item or throw not found service error.
    const item = await Item.query().findById(itemId).throwIfNotFound();

    const itemWarehouses = await ItemWarehouseQuantity.query()
      .where('itemId', itemId)
      .withGraphFetched('warehouse');

    // Retrieves the transformed items warehouses.
    return this.transformer.transform(
      tenantId,
      itemWarehouses,
      new GetItemWarehouseTransformer()
    );
  };
}
