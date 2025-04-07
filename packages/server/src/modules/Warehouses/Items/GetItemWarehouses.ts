import { GetItemWarehouseTransformer } from './GettItemWarehouseTransformer';
import { Inject, Injectable } from '@nestjs/common';
import { ItemWarehouseQuantity } from '../models/ItemWarehouseQuantity';
import { Item } from '@/modules/Items/models/Item';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetItemWarehouses {
  constructor(
    @Inject(ItemWarehouseQuantity.name)
    private readonly itemWarehouseQuantityModel: TenantModelProxy<
      typeof ItemWarehouseQuantity
    >,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
    private readonly transformer: TransformerInjectable,
  ) {}

  /**
   * Retrieves the item warehouses.
   * @param {number} itemId
   * @returns
   */
  public getItemWarehouses = async (itemId: number) => {
    // Retrieves specific item or throw not found service error.
    const item = await this.itemModel()
      .query()
      .findById(itemId)
      .throwIfNotFound();

    const itemWarehouses = await this.itemWarehouseQuantityModel()
      .query()
      .where('itemId', itemId)
      .withGraphFetched('warehouse');

    // Retrieves the transformed items warehouses.
    return this.transformer.transform(
      itemWarehouses,
      new GetItemWarehouseTransformer(),
    );
  };
}
