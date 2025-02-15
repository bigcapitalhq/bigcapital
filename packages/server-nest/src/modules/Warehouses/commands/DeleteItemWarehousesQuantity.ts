import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { ItemWarehouseQuantity } from '../models/ItemWarehouseQuantity';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class DeleteItemWarehousesQuantity {
  /**
   * @param {typeof ItemWarehouseQuantity} itemWarehouseQuantityModel - Item warehouse quantity model.
   */
  constructor(
    @Inject(ItemWarehouseQuantity.name)
    private readonly itemWarehouseQuantityModel: TenantModelProxy<
      typeof ItemWarehouseQuantity
    >,
  ) {}

  /**
   * Deletes the given item warehouses quantities.
   * @param {number} itemId
   * @param {Knex.Transaction} trx -
   */
  public deleteItemWarehousesQuantity = async (
    itemId: number,
    trx?: Knex.Transaction,
  ): Promise<void> => {
    await this.itemWarehouseQuantityModel()
      .query(trx)
      .where('itemId', itemId)
      .delete();
  };
}
