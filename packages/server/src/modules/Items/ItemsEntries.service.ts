import { Knex } from 'knex';
import { sumBy, difference, map, uniq, keyBy } from 'lodash';
import { Inject, Injectable } from '@nestjs/common';
import { Item } from './models/Item';
import { ItemEntry } from '../TransactionItemEntry/models/ItemEntry';
import { ServiceError } from './ServiceError';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { entriesAmountDiff } from '@/utils/entries-amount-diff';
import { ItemEntryDto } from '../TransactionItemEntry/dto/ItemEntry.dto';
import { Account } from '../Accounts/models/Account.model';
import { ACCOUNT_PARENT_TYPE, ACCOUNT_ROOT_TYPE } from '@/constants/accounts';

const ERRORS = {
  ITEMS_NOT_FOUND: 'ITEMS_NOT_FOUND',
  ENTRIES_IDS_NOT_FOUND: 'ENTRIES_IDS_NOT_FOUND',
  NOT_PURCHASE_ABLE_ITEMS: 'NOT_PURCHASE_ABLE_ITEMS',
  NOT_SELL_ABLE_ITEMS: 'NOT_SELL_ABLE_ITEMS',
  ENTRIES_ITEM_OR_DESCRIPTION_REQUIRED: 'ENTRIES_ITEM_OR_DESCRIPTION_REQUIRED',
  ENTRIES_ACCOUNT_REQUIRED: 'ENTRIES_ACCOUNT_REQUIRED',
  ENTRIES_ACCOUNT_NOT_FOUND: 'ENTRIES_ACCOUNT_NOT_FOUND',
  ENTRIES_ACCOUNT_TYPE_INVALID: 'ENTRIES_ACCOUNT_TYPE_INVALID',
};

export type ItemEntryAccountField = 'sellAccountId' | 'costAccountId';

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

    @Inject(Account.name)
    private readonly accountModel: TenantModelProxy<typeof Account>,
  ) {}

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

    const itemsIds = map(itemsEntries, 'itemId').filter(Boolean);
    const inventoryItems = itemsIds.length
      ? await this.itemModel()
          .query()
          .whereIn('id', itemsIds)
          .where('type', 'inventory')
      : [];

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
    const entriesItemsIds = entries.map((e) => e.itemId).filter(Boolean);

    const inventoryItems = entriesItemsIds.length
      ? await this.itemModel()
          .query(trx)
          .whereIn('id', entriesItemsIds)
          .where('type', 'inventory')
      : [];

    return entries.filter((entry) =>
      inventoryItems.some((item) => item.id === entry.itemId),
    );
  }

  /**
   * Validates the entries items ids.
   * @param {IItemEntryDTO[]} itemEntries - Items entries.
   * @returns {Promise<Item[]>}
   */
  public async validateItemsIdsExistance(
    itemEntries: Array<{ itemId?: number }>,
  ) {
    const itemsIds = uniq(itemEntries.map((e) => e.itemId).filter(Boolean));

    const foundItems = itemsIds.length
      ? await this.itemModel().query().whereIn('id', itemsIds)
      : [];

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
  public async validateNonPurchasableEntriesItems(itemEntries: ItemEntryDto[]) {
    const itemsIds = uniq(
      itemEntries.map((e: ItemEntryDto) => e.itemId).filter(Boolean),
    );
    if (!itemsIds.length) {
      return;
    }
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
    const itemsIds = uniq(
      itemEntries.map((e: ItemEntryDto) => e.itemId).filter(Boolean),
    );
    if (!itemsIds.length) {
      return;
    }
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
    diffEntries.forEach((entry: { itemId: number; quantity: number }) => {
      const changeQuantityOper = this.itemModel()
        .query()
        .where({ id: entry.itemId, type: 'inventory' })
        .modify('updateQuantityOnHand', entry.quantity);

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
    return this.changeItemsQuantity(
      entries.map((entry) => ({
        ...entry,
        quantity: entry.quantity * -1,
      })) as ItemEntry[],
    );
  }

  /**
   * Validates the entries have an item or a description with the account
   * required to post the entry to the ledger.
   * @param {ItemEntryDto[]} entries - Items entries.
   * @param {ItemEntryAccountField} accountField - The account field name.
   */
  public async validateEntriesItemOrAccount(
    entries: ItemEntryDto[],
    accountField: ItemEntryAccountField,
  ) {
    const accountRequiredEntries = entries.filter((entry) => !entry.itemId);

    accountRequiredEntries.forEach((entry) => {
      if (!entry.description || !String(entry.description).trim()) {
        throw new ServiceError(
          ERRORS.ENTRIES_ITEM_OR_DESCRIPTION_REQUIRED,
          'Each line item must have an item or a description.',
        );
      }
      if (!entry[accountField]) {
        throw new ServiceError(
          ERRORS.ENTRIES_ACCOUNT_REQUIRED,
          'A sell or cost account is required for line items without an item.',
        );
      }
    });

    const accountIds = uniq(
      entries.map((entry) => entry[accountField]).filter(Boolean),
    );
    if (!accountIds.length) {
      return;
    }
    const accounts = await this.accountModel()
      .query()
      .whereIn('id', accountIds);
    const accountsById = keyBy(accounts, 'id');

    entries.forEach((entry) => {
      const accountId = entry[accountField];
      if (!accountId) {
        return;
      }
      const account = accountsById[accountId];

      if (!account) {
        throw new ServiceError(
          ERRORS.ENTRIES_ACCOUNT_NOT_FOUND,
          'The selected account was not found.',
        );
      }
      if (
        accountField === 'sellAccountId' &&
        !account.isRootType(ACCOUNT_ROOT_TYPE.INCOME)
      ) {
        throw new ServiceError(
          ERRORS.ENTRIES_ACCOUNT_TYPE_INVALID,
          'The sell account must be an income account.',
        );
      }
      if (
        accountField === 'costAccountId' &&
        !account.isParentType(ACCOUNT_PARENT_TYPE.EXPENSE)
      ) {
        throw new ServiceError(
          ERRORS.ENTRIES_ACCOUNT_TYPE_INVALID,
          'The cost account must be an expense account.',
        );
      }
    });
  }

  /**
   * Sets the cost/sell accounts to the invoice entries.
   */
  public setItemsEntriesDefaultAccounts = async (entries: ItemEntryDto[]) => {
    const entriesItemsIds = uniq(entries.map((e) => e.itemId).filter(Boolean));
    const items = entriesItemsIds.length
      ? await this.itemModel().query().whereIn('id', entriesItemsIds)
      : [];

    return entries.map((entry) => {
      const item = entry.itemId
        ? items.find((i) => i.id === entry.itemId)
        : undefined;

      if (!item) {
        return entry;
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
   * Sets the default cost accounts to the purchase entries.
   */
  public setPurchaseEntriesDefaultAccounts = async (
    entries: ItemEntryDto[],
  ) => {
    const entriesItemsIds = uniq(entries.map((e) => e.itemId).filter(Boolean));
    const items = entriesItemsIds.length
      ? await this.itemModel().query().whereIn('id', entriesItemsIds)
      : [];

    return entries.map((entry) => {
      const item = entry.itemId
        ? items.find((i) => i.id === entry.itemId)
        : undefined;

      if (!item) {
        return entry;
      }
      return {
        ...entry,
        ...(item.type !== 'inventory' && {
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
