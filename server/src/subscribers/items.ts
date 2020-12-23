import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import ItemsService from 'services/Items/ItemsService';

@EventSubscriber()
export default class ItemsSubscriber{
  itemsService: ItemsService;

  constructor() {
    this.itemsService = Container.get(ItemsService);
  };

  /**
   * Handle writing opening item inventory transaction.
   */
  @On(events.item.onCreated)
  handleWriteOpeningInventoryTransaction({ tenantId, item }) {
    // Can't continue if the opeing cost, quantity or opening date was empty.
    if (!item.openingCost || !item.openingQuantity || !item.openingDate) {
      return;
    }
    // Records the opeing items inventory transaction once the item created.
    this.itemsService.recordOpeningItemsInventoryTransaction(
      tenantId,
      item.id,
      item.openingQuantity,
      item.openingCost,
      item.openingDate,
    )
  }
}