import { Knex } from 'knex';
import { sumBy, difference, map } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { Item } from './models/Item';
import { ItemEntry } from '../TransactionItemEntry/models/ItemEntry';
import { ServiceError } from './ServiceError';
import { IItemEntryDTO } from '../TransactionItemEntry/ItemEntry.types';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { entriesAmountDiff } from '@/utils/entries-amount-diff';
import { ItemEntryDto } from '../TransactionItemEntry/dto/ItemEntry.dto';

const ERRORS = {
  ITEMS_NOT_FOUND: 'ITEMS_NOT_FOUND',
  ENTRIES_IDS_NOT_FOUND: 'ENTRIES_IDS_NOT_FOUND',
  NOT_PURCHASE_ABLE_ITEMS: 'NOT_PURCHASE_ABLE_ITEMS',
  NOT_SELL_ABLE_ITEMS: 'NOT_SELL_ABLE_ITEMS',
};

@Injectable()
export class ItemsEntriesService {
  /**
   * @param {TenantModelProxy<typeof Item>} itemModel - Item model.
   * @param {TenantModelProxy<typeof ItemEntry>} itemEntryModel - Item entry model.
   */
  constructor(
    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,

    @Inject(ItemEntry.name)
    private readonly itemEntryModel: TenantModelProxy<typeof ItemEntry>,
  ) { }

  /**
   * Retrieve the inventory items entries of the reference id and type.
   * @param {string} referenceType - Reference type.
   * @param {number} referenceId - Reference id.
   * @return {Promise<IItemEntry[]>}
   */
  public async getInventoryEntries(
    referenceType: string,
    referenceId: number,
  ): Promise<ItemEntry[]> {
    const itemsEntries = await this.itemEntryModel()
      .query()
      .where('reference_type', referenceType)
      .where('reference_id', referenceId);

    const inventoryItems = await this.itemModel()
      .query()
      .whereIn('id', map(itemsEntries, 'itemId'))
      .where('type', 'inventory');

    const inventoryItemsIds = map(inventoryItems, 'id');

    return itemsEntries.filter(
      (itemEntry) => inventoryItemsIds.indexOf(itemEntry.itemId) !== -1,
    );
  }

  /**
   * Filter the given entries to inventory entries.
   * @param {IItemEntry[]} entries - Items entries.
   * @param {Knex.Transaction} trx - Knex transaction.
   * @returns {Promise<IItemEntry[]>}
   */
  public async filterInventoryEntries(
    entries: ItemEntry[],
    trx?: Knex.Transaction,
  ): Promise<ItemEntry[]> {
    const entriesItemsIds = entries.map((e) => e.itemId);

    const inventoryItems = await this.itemModel()
      .query(trx)
      .whereIn('id', entriesItemsIds)
      .where('type', 'inventory');

    return entries.filter((entry) =>
      inventoryItems.some((item) => item.id === entry.itemId),
    );
  }

  /**
   * Validates the entries items ids.
   * @param {IItemEntryDTO[]} itemEntries - Items entries.
   * @returns {Promise<Item[]>}
   */
  public async validateItemsIdsExistance(itemEntries: Array<{ itemId: number }>) {
    const itemsIds = itemEntries.map((e) => e.itemId);

    const foundItems = await this.itemModel().query().whereIn('id', itemsIds);

    const foundItemsIds = foundItems.map((item: Item) => item.id);
    const notFoundItemsIds = difference(itemsIds, foundItemsIds);

    if (notFoundItemsIds.length > 0) {
      throw new ServiceError(ERRORS.ITEMS_NOT_FOUND);
    }
    return foundItems;
  }

  /**
   * Validates the entries ids existance on the storage.
   * @param {number} referenceId -
   * @param {string} referenceType -
   * @param {IItemEntryDTO[]} entries -
   */
  public async validateEntriesIdsExistance(
    referenceId: number,
    referenceType: string,
    billEntries: ItemEntryDto[],
  ) {
    const entriesIds = billEntries
      .filter((e: ItemEntry) => e.id)
      .map((e: ItemEntry) => e.id);

    const storedEntries = await this.itemEntryModel()
      .query()
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
   * @param {IItemEntryDTO[]} itemEntries -
   */
  public async validateNonPurchasableEntriesItems(
    itemEntries: ItemEntryDto[],
  ) {
    const itemsIds = itemEntries.map((e: ItemEntryDto) => e.itemId);
    const purchasbleItems = await this.itemModel()
      .query()
      .where('purchasable', true)
      .whereIn('id', itemsIds);

    const purchasbleItemsIds = purchasbleItems.map((item: Item) => item.id);
    const notPurchasableItems = difference(itemsIds, purchasbleItemsIds);

    if (notPurchasableItems.length > 0) {
      throw new ServiceError(ERRORS.NOT_PURCHASE_ABLE_ITEMS);
    }
  }

  /**
   * Validate the entries items that not sell-able.
   * @param {IItemEntryDTO[]} itemEntries -
   */
  public async validateNonSellableEntriesItems(itemEntries: ItemEntryDto[]) {
    const itemsIds = itemEntries.map((e: ItemEntryDto) => e.itemId);

    const sellableItems = await this.itemModel()
      .query()
      .where('sellable', true)
      .whereIn('id', itemsIds);

    const sellableItemsIds = sellableItems.map((item: Item) => item.id);
    const nonSellableItems = difference(itemsIds, sellableItemsIds);

    if (nonSellableItems.length > 0) {
      throw new ServiceError(ERRORS.NOT_SELL_ABLE_ITEMS);
    }
  }

  /**
   * Changes items quantity from the given items entries the new and old onces.
   * @param {IItemEntry[]} entries - Items entries.
   * @param {IItemEntry[]} oldEntries - Old items entries.
   */
  public async changeItemsQuantity(
    entries: ItemEntry[],
    oldEntries?: ItemEntry[],
  ): Promise<void> {
    const opers = [];

    const diffEntries = entriesAmountDiff(
      entries,
      oldEntries,
      'quantity',
      'itemId',
    );
    diffEntries.forEach((entry: ItemEntry) => {
      const changeQuantityOper = this.itemModel()
        .query()
        .where({ id: entry.itemId, type: 'inventory' })
        .modify('quantityOnHand', entry.quantity);

      opers.push(changeQuantityOper);
    });
    await Promise.all(opers);
  }

  /**
   * Increment items quantity from the given items entries.
   * @param {IItemEntry[]} entries - Items entries.
   */
  public async incrementItemsEntries(entries: ItemEntry[]): Promise<void> {
    return this.changeItemsQuantity(entries);
  }

  /**
   * Decrement items quantity from the given items entries.
   * @param {IItemEntry[]} entries - Items entries.
   */
  public async decrementItemsQuantity(entries: ItemEntry[]): Promise<void> {
    // return this.changeItemsQuantity(
    //   entries.map((entry) => ({
    //     ...entry,
    //     quantity: entry.quantity * -1,
    //   })),
    // );
  }

  /**
   * Sets the cost/sell accounts to the invoice entries.
   */
  public setItemsEntriesDefaultAccounts = async (entries: ItemEntryDto[]) => {
    const entriesItemsIds = entries.map((e) => e.itemId);
    const items = await this.itemModel().query().whereIn('id', entriesItemsIds);

    return entries.map((entry) => {
      const item = items.find((i) => i.id === entry.itemId);

      if (!item) {
        throw new Error(`Item with id ${entry.itemId} not found`);
      }

      return {
        ...entry,
        sellAccountId: entry.sellAccountId || item.sellAccountId,
        ...(item.type === 'inventory' && {
          costAccountId: entry.costAccountId || item.costAccountId,
        }),
      };
    });
  };

  /**
   * Retrieve the total items entries.
   * @param {ItemEntry[]} entries - Items entries.
   * @returns {number}
   */
  public getTotalItemsEntries(entries: ItemEntryDto[]): number {
    return sumBy(entries, (e) => ItemEntry.calcAmount(e));
  }

  /**
   * Retrieve the non-zero tax items entries.
   * @param {ItemEntry[]} entries -
   * @returns {ItemEntry[]}
   */
  public getNonZeroEntries(entries: ItemEntry[]): ItemEntry[] {
    return entries.filter((e) => e.taxRate > 0);
  }
}
