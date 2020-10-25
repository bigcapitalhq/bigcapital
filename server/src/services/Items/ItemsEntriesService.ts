import { difference } from 'lodash';
import { Inject, Service } from 'typedi';
import {
  IItemEntry,
  IItemEntryDTO,
  IItem,
} from 'interfaces';
import { ServiceError } from 'exceptions';
import TenancyService from 'services/Tenancy/TenancyService';

const ERRORS = {
  ITEMS_NOT_FOUND: 'ITEMS_NOT_FOUND',
  ENTRIES_IDS_NOT_FOUND: 'ENTRIES_IDS_NOT_FOUND',
  NOT_PURCHASE_ABLE_ITEMS: 'NOT_PURCHASE_ABLE_ITEMS',
  NOT_SELL_ABLE_ITEMS: 'NOT_SELL_ABLE_ITEMS'
};

@Service()
export default class ItemsEntriesService {
  @Inject()
  tenancy: TenancyService;

  /**
   * Validates the entries items ids.
   * @async
   * @param {number} tenantId - 
   * @param {IItemEntryDTO} itemEntries -
   */
  public async validateItemsIdsExistance(tenantId: number, itemEntries: IItemEntryDTO[]) {
    const { Item } = this.tenancy.models(tenantId);
    const itemsIds = itemEntries.map((e) => e.itemId);
    
    const foundItems = await Item.query().whereIn('id', itemsIds);

    const foundItemsIds = foundItems.map((item: IItem) => item.id);
    const notFoundItemsIds = difference(itemsIds, foundItemsIds);

    if (notFoundItemsIds.length > 0) {
      throw new ServiceError(ERRORS.ITEMS_NOT_FOUND);
    }
  }

   /**
   * Validates the entries ids existance on the storage.
   * @param {number} tenantId - 
   * @param {number} billId - 
   * @param {IItemEntry[]} billEntries -
   */
  public async validateEntriesIdsExistance(tenantId: number, referenceId: number, referenceType: string, billEntries: IItemEntryDTO[]) {
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
      throw new ServiceError(ERRORS.ENTRIES_IDS_NOT_FOUND)
    }
  }


  /**
   * Validate the entries items that not purchase-able. 
   */
  public async validateNonPurchasableEntriesItems(tenantId: number, itemEntries: IItemEntryDTO[]) {
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
  public async validateNonSellableEntriesItems(tenantId: number, itemEntries: IItemEntryDTO[]) {
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
}