import { Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import { DeleteItemWarehousesQuantity } from '../DeleteItemWarehousesQuantity';
import { IItemEventDeletingPayload } from '@/interfaces';

@Service()
export class DeleteItemWarehousesQuantitySubscriber {
  @Inject()
  private deleteItemWarehousesQuantity: DeleteItemWarehousesQuantity;

  /**
   * Attaches events.
   */
  public attach(bus) {
    bus.subscribe(
      events.item.onDeleting,
      this.deleteItemWarehouseQuantitiesOnItemDelete
    );
  }

  /**
   * Deletes the given item warehouses quantities once the item deleting.
   * @param {IItemEventDeletingPayload} payload -
   */
  private deleteItemWarehouseQuantitiesOnItemDelete = async ({
    tenantId,
    oldItem,
    trx,
  }: IItemEventDeletingPayload) => {
    await this.deleteItemWarehousesQuantity.deleteItemWarehousesQuantity(
      tenantId,
      oldItem.id,
      trx
    );
  };
}
