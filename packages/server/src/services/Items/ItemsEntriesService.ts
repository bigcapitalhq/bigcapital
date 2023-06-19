import { sumBy, difference, map } from 'lodash';
import { Inject, Service } from 'typedi';
import { IItemEntry, IItemEntryDTO, IItem } from '@/interfaces';
import { ServiceError } from '@/exceptions';
import TenancyService from '@/services/Tenancy/TenancyService';
import { entriesAmountDiff } from 'utils';
import { ItemEntry } from 'models';

const ERRORS = {
  ITEMS_NOT_FOUND: 'ITEMS_NOT_FOUND',
  ENTRIES_IDS_NOT_FOUND: 'ENTRIES_IDS_NOT_FOUND',
  NOT_PURCHASE_ABLE_ITEMS: 'NOT_PURCHASE_ABLE_ITEMS',
  NOT_SELL_ABLE_ITEMS: 'NOT_SELL_ABLE_ITEMS',
};

@Service()
export default class ItemsEntriesService {
  @Inject()
  tenancy: TenancyService;

  /**
   * Retrieve the inventory items entries of the reference id and type.
   * @param {number} tenantId
   * @param {string} referenceType
   * @param {string} referenceId
   * @return {Promise<IItemEntry[]>}
   */
  public async getInventoryEntries(
    tenantId: number,
    referenceType: string,
    referenceId: number
  ): Promise<IItemEntry[]> {
    const { Item, ItemEntry } = this.tenancy.models(tenantId);

    const itemsEntries = await ItemEntry.query()
      .where('reference_type', referenceType)
      .where('reference_id', referenceId);

    // Inventory items.
    const inventoryItems = await Item.query()
      .whereIn('id', map(itemsEntries, 'itemId'))
      .where('type', 'inventory');

    // Inventory items ids.
    const inventoryItemsIds = map(inventoryItems, 'id');

    // Filtering the inventory items entries.
    const inventoryItemsEntries = itemsEntries.filter(
      (itemEntry) => inventoryItemsIds.indexOf(itemEntry.itemId) !== -1
    );
    return inventoryItemsEntries;
  }

  /**
   * Filter the given entries to inventory entries.
   * @param {IItemEntry[]} entries -
   * @returns {IItemEntry[]}
   */
  public async filterInventoryEntries(
    tenantId: number,
    entries: IItemEntry[]
  ): Promise<IItemEntry[]> {
    const { Item } = this.tenancy.models(tenantId);
    const entriesItemsIds = entries.map((e) => e.itemId);

    // Retrieve entries inventory items.
    const inventoryItems = await Item.query()
      .whereIn('id', entriesItemsIds)
      .where('type', 'inventory');

    const inventoryEntries = entries.filter((entry) =>
      inventoryItems.some((item) => item.id === entry.itemId)
    );
    return inventoryEntries;
  }

  /**
   * Validates the entries items ids.
   * @async
   * @param {number} tenantId -
   * @param {IItemEntryDTO} itemEntries -
   */
  public async validateItemsIdsExistence(
    tenantId: number,
    itemEntries: IItemEntryDTO[]
  ) {
    const { Item } = this.tenancy.models(tenantId);
    const itemsIds = itemEntries.map((e) => e.itemId);

    const foundItems = await Item.query().whereIn('id', itemsIds);

    const foundItemsIds = foundItems.map((item: IItem) => item.id);
    const notFoundItemsIds = difference(itemsIds, foundItemsIds);

    if (notFoundItemsIds.length > 0) {
      throw new ServiceError(ERRORS.ITEMS_NOT_FOUND);
    }
    return foundItems;
  }

  /**
   * Validates the entries ids existence on the storage.
   * @param {number} tenantId -
   * @param {number} billId -
   * @param {IItemEntry[]} billEntries -
   */
  public async validateEntriesIdsExistence(
    tenantId: number,
    referenceId: number,
    referenceType: string,
    billEntries: IItemEntryDTO[]
  ) {
    const { ItemEntry } = this.tenancy.models(tenantId);
    const entriesIds = billEntries
      .filter((e: IItemEntry) => e.id)
      .map((e: IItemEntry) => e.id);

    const storedEntries = await ItemEntry.query()
      .whereIn('reference_id', [referenceId])
      .whereIn('reference_type', [referenceType]);

    const storedEntriesIds = storedEntries.map((entry) => entry.id);
    const notFoundEntriesIds = difference(entriesIds, storedEntriesIds);

    if (notFoundEntriesIds.length > 0) {
      throw new ServiceError(ERRORS.ENTRIES_IDS_NOT_FOUND);
    }
  }

  /**
   * Validate the entries items that not purchase-able.
   */
  public async validateNonPurchasableEntriesItems(
    tenantId: number,
    itemEntries: IItemEntryDTO[]
  ) {
    const { Item } = this.tenancy.models(tenantId);
    const itemsIds = itemEntries.map((e: IItemEntryDTO) => e.itemId);

    const purchasbleItems = await Item.query()
      .where('purchasable', true)
      .whereIn('id', itemsIds);

    const purchasbleItemsIds = purchasbleItems.map((item: IItem) => item.id);
    const notPurchasableItems = difference(itemsIds, purchasbleItemsIds);

    if (notPurchasableItems.length > 0) {
      throw new ServiceError(ERRORS.NOT_PURCHASE_ABLE_ITEMS);
    }
  }

  /**
   * Validate the entries items that not sell-able.
   */
  public async validateNonSellableEntriesItems(
    tenantId: number,
    itemEntries: IItemEntryDTO[]
  ) {
    const { Item } = this.tenancy.models(tenantId);
    const itemsIds = itemEntries.map((e: IItemEntryDTO) => e.itemId);

    const sellableItems = await Item.query()
      .where('sellable', true)
      .whereIn('id', itemsIds);

    const sellableItemsIds = sellableItems.map((item: IItem) => item.id);
    const nonSellableItems = difference(itemsIds, sellableItemsIds);

    if (nonSellableItems.length > 0) {
      throw new ServiceError(ERRORS.NOT_SELL_ABLE_ITEMS);
    }
  }

  /**
   * Changes items quantity from the given items entries the new and old onces.
   * @param {number} tenantId
   * @param {IItemEntry} entries - Items entries.
   * @param {IItemEntry} oldEntries - Old items entries.
   */
  public async changeItemsQuantity(
    tenantId: number,
    entries: IItemEntry[],
    oldEntries?: IItemEntry[]
  ): Promise<void> {
    const { itemRepository } = this.tenancy.repositories(tenantId);
    const opers = [];

    const diffEntries = entriesAmountDiff(
      entries,
      oldEntries,
      'quantity',
      'itemId'
    );
    diffEntries.forEach((entry: IItemEntry) => {
      const changeQuantityOper = itemRepository.changeNumber(
        { id: entry.itemId, type: 'inventory' },
        'quantityOnHand',
        entry.quantity
      );
      opers.push(changeQuantityOper);
    });
    await Promise.all(opers);
  }

  /**
   * Increment items quantity from the given items entries.
   * @param {number} tenantId - Tenant id.
   * @param {IItemEntry} entries - Items entries.
   */
  public async incrementItemsEntries(
    tenantId: number,
    entries: IItemEntry[]
  ): Promise<void> {
    return this.changeItemsQuantity(tenantId, entries);
  }

  /**
   * Decrement items quantity from the given items entries.
   * @param {number} tenantId - Tenant id.
   * @param {IItemEntry} entries - Items entries.
   */
  public async decrementItemsQuantity(
    tenantId: number,
    entries: IItemEntry[]
  ): Promise<void> {
    return this.changeItemsQuantity(
      tenantId,
      entries.map((entry) => ({
        ...entry,
        quantity: entry.quantity * -1,
      }))
    );
  }

  /**
   * Sets the cost/sell accounts to the invoice entries.
   */
  setItemsEntriesDefaultAccounts(tenantId: number) {
    return async (entries: IItemEntry[]) => {
      const { Item } = this.tenancy.models(tenantId);

      const entriesItemsIds = entries.map((e) => e.itemId);
      const items = await Item.query().whereIn('id', entriesItemsIds);

      return entries.map((entry) => {
        const item = items.find((i) => i.id === entry.itemId);

        return {
          ...entry,
          sellAccountId: entry.sellAccountId || item.sellAccountId,
          ...(item.type === 'inventory' && {
            costAccountId: entry.costAccountId || item.costAccountId,
          }),
        };
      });
    };
  }

  /**
   * Retrieve the total items entries.
   * @param entries 
   * @returns 
   */
  getTotalItemsEntries(entries: ItemEntry[]): number {
    return sumBy(entries, (e) => ItemEntry.calcAmount(e));
  }
}
