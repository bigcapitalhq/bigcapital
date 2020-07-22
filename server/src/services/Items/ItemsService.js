import { difference } from "lodash";
import { Item } from '@/models';

export default class ItemsService {

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