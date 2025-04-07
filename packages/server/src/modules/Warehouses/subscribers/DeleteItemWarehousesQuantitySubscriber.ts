import { Injectable } from '@nestjs/common';
import { DeleteItemWarehousesQuantity } from '../commands/DeleteItemWarehousesQuantity';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IItemEventDeletingPayload } from '@/interfaces/Item';

@Injectable()
export class DeleteItemWarehousesQuantitySubscriber {
  constructor(
    private readonly deleteItemWarehousesQuantity: DeleteItemWarehousesQuantity,
  ) {}

  /**
   * Deletes the given item warehouses quantities once the item deleting.
   * @param {IItemEventDeletingPayload} payload -
   */
  @OnEvent(events.item.onDeleting)
  async deleteItemWarehouseQuantitiesOnItemDelete({
    oldItem,
    trx,
  }: IItemEventDeletingPayload) {
    await this.deleteItemWarehousesQuantity.deleteItemWarehousesQuantity(
      oldItem.id,
      trx,
    );
  }
}
