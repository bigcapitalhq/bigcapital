import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { ItemWarehouseQuantity } from '../models/ItemWarehouseQuantity';

@Injectable()
export class DeleteItemWarehousesQuantity {
  /**
   * @param {typeof ItemWarehouseQuantity} itemWarehouseQuantityModel - Item warehouse quantity model.
   */
  constructor(
    @Inject(ItemWarehouseQuantity.name)
    private readonly itemWarehouseQuantityModel: typeof ItemWarehouseQuantity,
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
    await this.itemWarehouseQuantityModel
      .query(trx)
      .where('itemId', itemId)
      .delete();
  };
}
