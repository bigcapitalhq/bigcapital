import { difference } from "lodash";
import { Service, Inject } from "typedi";
import { IItemsFilter } from 'interfaces';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import TenancyService from 'services/Tenancy/TenancyService';

@Service()
export default class ItemsService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

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

  writeItemInventoryOpeningQuantity(tenantId: number, itemId: number, openingQuantity: number, averageCost: number) {
    
  }

  /**
   * Retrieve items datatable list.
   * @param {number} tenantId 
   * @param {IItemsFilter} itemsFilter 
   */
  async getItemsList(tenantId: number, itemsFilter: IItemsFilter) {
    const { Item } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(tenantId, Item, itemsFilter);

    const items = await Item.query().onBuild((builder) => {
      builder.withGraphFetched('inventoryAccount');
      builder.withGraphFetched('sellAccount');
      builder.withGraphFetched('costAccount');
      builder.withGraphFetched('category');

      dynamicFilter.buildQuery()(builder);
    });
    return items;
  }
}