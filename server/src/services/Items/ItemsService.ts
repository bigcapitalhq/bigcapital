import { difference } from "lodash";
import { Service, Inject } from "typedi";
import TenancyService from '@/services/Tenancy/TenancyService';

@Service()
export default class ItemsService {
  @Inject()
  tenancy: TenancyService;

  async newItem(tenantId: number, item: any) {
    const { Item } = this.tenancy.models(tenantId);
    const storedItem = await Item.query()
      .insertAndFetch({
        ...item,
      });
    return storedItem;
  }

  async editItem(tenantId: number, item: any, itemId: number) {
    const { Item } = this.tenancy.models(tenantId);
    const updateItem = await Item.query()
      .findById(itemId)
      .patch({
        ...item,
      });
    return updateItem;
  }

  async deleteItem(tenantId: number, itemId: number) {
    const { Item } = this.tenancy.models(tenantId);
    return Item.query()
      .findById(itemId)
      .delete();
  }

  /**
   * Retrieve the item details of the given id with associated details.
   * @param {number} tenantId 
   * @param {number} itemId 
   */
  async getItemWithMetadata(tenantId: number, itemId: number) {
    const { Item } = this.tenancy.models(tenantId);
    return Item.query()
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
  async isItemsIdsExists(tenantId: number, itemsIDs: number[]) {
    const { Item } = this.tenancy.models(tenantId);

    const storedItems = await Item.query().whereIn('id', itemsIDs);
    const storedItemsIds = storedItems.map((t) => t.id);

    const notFoundItemsIds = difference(
      itemsIDs,
      storedItemsIds,
    );
    return notFoundItemsIds;
  }
}