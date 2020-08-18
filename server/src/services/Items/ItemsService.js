import { difference } from "lodash";
import { Item } from '@/models';

export default class ItemsService {

  static async newItem(item) {
    const storedItem = await Item.tenant()
      .query()
      .insertAndFetch({
        ...item,
      });
    return storedItem;
  }

  static async editItem(item, itemId) {
    const updateItem = await Item.tenant()
      .query()
      .findById(itemId)
      .patch({
        ...item,
      });
    return updateItem;
  }

  static async deleteItem(itemId) {
    return Item.tenant()
      .query()
      .findById(itemId)
      .delete();
  }

  static async getItemWithMetadata(itemId) {
    return Item.tenant()
      .query()
      .findById(itemId)
      .withGraphFetched(
        'costAccount',
        'sellAccount',
        'inventoryAccount',
        'category'
      );
  }

  /**
   * Validates the given items IDs exists or not returns the not found ones.
   * @param {Array} itemsIDs 
   * @return {Array}
   */
  static async isItemsIdsExists(itemsIDs) {
    const storedItems = await Item.tenant().query().whereIn('id', itemsIDs);
    const storedItemsIds = storedItems.map((t) => t.id);

    const notFoundItemsIds = difference(
      itemsIDs,
      storedItemsIds,
    );
    return notFoundItemsIds;
  }
}