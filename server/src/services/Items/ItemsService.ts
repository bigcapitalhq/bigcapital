import { defaultTo, difference, omit } from 'lodash';
import { Service, Inject } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import events from 'subscribers/events';
import { IItemsFilter, IItemsService, IItemDTO, IItem } from 'interfaces';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import TenancyService from 'services/Tenancy/TenancyService';
import { ServiceError } from 'exceptions';
import InventoryService from 'services/Inventory/Inventory';

const ERRORS = {
  NOT_FOUND: 'NOT_FOUND',
  ITEM_NAME_EXISTS: 'ITEM_NAME_EXISTS',
  ITEM_CATEOGRY_NOT_FOUND: 'ITEM_CATEOGRY_NOT_FOUND',
  COST_ACCOUNT_NOT_COGS: 'COST_ACCOUNT_NOT_COGS',
  COST_ACCOUNT_NOT_FOUMD: 'COST_ACCOUNT_NOT_FOUMD',
  SELL_ACCOUNT_NOT_FOUND: 'SELL_ACCOUNT_NOT_FOUND',
  SELL_ACCOUNT_NOT_INCOME: 'SELL_ACCOUNT_NOT_INCOME',

  INVENTORY_ACCOUNT_NOT_FOUND: 'INVENTORY_ACCOUNT_NOT_FOUND',
  INVENTORY_ACCOUNT_NOT_INVENTORY: 'INVENTORY_ACCOUNT_NOT_INVENTORY',

  ITEMS_HAVE_ASSOCIATED_TRANSACTIONS: 'ITEMS_HAVE_ASSOCIATED_TRANSACTIONS',
  ITEM_HAS_ASSOCIATED_TRANSACTINS: 'ITEM_HAS_ASSOCIATED_TRANSACTINS',
};

@Service()
export default class ItemsService implements IItemsService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject('logger')
  logger: any;

  @Inject()
  inventoryService: InventoryService;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  /**
   * Retrieve item details or throw not found error.
   * @param {number} tenantId
   * @param {number} itemId
   * @return {Promise<void>}
   */
  private async getItemOrThrowError(
    tenantId: number,
    itemId: number
  ): Promise<void> {
    const { Item } = this.tenancy.models(tenantId);

    this.logger.info('[items] validate item id existance.', { itemId });
    const foundItem = await Item.query().findById(itemId);

    if (!foundItem) {
      this.logger.info('[items] item not found.', { itemId });
      throw new ServiceError(ERRORS.NOT_FOUND);
    }
    return foundItem;
  }

  /**
   * Validate wether the given item name already exists on the storage.
   * @param {number} tenantId
   * @param {string} itemName
   * @param {number} notItemId
   * @return {Promise<void>}
   */
  private async validateItemNameUniquiness(
    tenantId: number,
    itemName: string,
    notItemId?: number
  ): Promise<void> {
    const { Item } = this.tenancy.models(tenantId);

    this.logger.info('[items] validate item name uniquiness.', {
      itemName,
      tenantId,
    });
    const foundItems: [] = await Item.query().onBuild((builder: any) => {
      builder.where('name', itemName);
      if (notItemId) {
        builder.whereNot('id', notItemId);
      }
    });
    if (foundItems.length > 0) {
      this.logger.info('[items] item name already exists.', {
        itemName,
        tenantId,
      });
      throw new ServiceError(ERRORS.ITEM_NAME_EXISTS);
    }
  }

  /**
   * Validate item COGS account existance and type.
   * @param {number} tenantId
   * @param {number} costAccountId
   * @return {Promise<void>}
   */
  private async validateItemCostAccountExistance(
    tenantId: number,
    costAccountId: number
  ): Promise<void> {
    const {
      accountRepository,
      accountTypeRepository,
    } = this.tenancy.repositories(tenantId);

    this.logger.info('[items] validate cost account existance.', {
      tenantId,
      costAccountId,
    });
    const COGSType = await accountTypeRepository.getByKey('cost_of_goods_sold');
    const foundAccount = await accountRepository.findOneById(costAccountId);

    if (!foundAccount) {
      this.logger.info('[items] cost account not found.', {
        tenantId,
        costAccountId,
      });
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_FOUMD);
    } else if (foundAccount.accountTypeId !== COGSType.id) {
      this.logger.info('[items] validate cost account not COGS type.', {
        tenantId,
        costAccountId,
      });
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_COGS);
    }
  }

  /**
   * Validate item sell account existance and type.
   * @param {number} tenantId - Tenant id.
   * @param {number} sellAccountId - Sell account id.
   */
  private async validateItemSellAccountExistance(
    tenantId: number,
    sellAccountId: number
  ) {
    const {
      accountRepository,
      accountTypeRepository,
    } = this.tenancy.repositories(tenantId);

    this.logger.info('[items] validate sell account existance.', {
      tenantId,
      sellAccountId,
    });
    const incomeType = await accountTypeRepository.getByKey('income');
    const foundAccount = await accountRepository.findOneById(sellAccountId);

    if (!foundAccount) {
      this.logger.info('[items] sell account not found.', {
        tenantId,
        sellAccountId,
      });
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_FOUND);
    } else if (foundAccount.accountTypeId !== incomeType.id) {
      this.logger.info('[items] sell account not income type.', {
        tenantId,
        sellAccountId,
      });
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_INCOME);
    }
  }

  /**
   * Validate item inventory account existance and type.
   * @param {number} tenantId
   * @param {number} inventoryAccountId
   */
  private async validateItemInventoryAccountExistance(
    tenantId: number,
    inventoryAccountId: number
  ) {
    const {
      accountTypeRepository,
      accountRepository,
    } = this.tenancy.repositories(tenantId);

    this.logger.info('[items] validate inventory account existance.', {
      tenantId,
      inventoryAccountId,
    });
    const otherAsset = await accountTypeRepository.getByKey('other_asset');
    const foundAccount = await accountRepository.findOneById(
      inventoryAccountId
    );

    if (!foundAccount) {
      this.logger.info('[items] inventory account not found.', {
        tenantId,
        inventoryAccountId,
      });
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_FOUND);
    } else if (otherAsset.id !== foundAccount.accountTypeId) {
      this.logger.info('[items] inventory account not inventory type.', {
        tenantId,
        inventoryAccountId,
      });
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_INVENTORY);
    }
  }

  /**
   * Validate item category existance.
   * @param {number} tenantId
   * @param {number} itemCategoryId
   */
  private async validateItemCategoryExistance(
    tenantId: number,
    itemCategoryId: number
  ) {
    const { ItemCategory } = this.tenancy.models(tenantId);
    const foundCategory = await ItemCategory.query().findById(itemCategoryId);

    if (!foundCategory) {
      throw new ServiceError(ERRORS.ITEM_CATEOGRY_NOT_FOUND);
    }
  }

  /**
   * Creates a new item.
   * @param {number} tenantId DTO
   * @param {IItemDTO} item
   * @return {Promise<IItem>}
   */
  public async newItem(tenantId: number, itemDTO: IItemDTO): Promise<IItem> {
    const { Item } = this.tenancy.models(tenantId);

    // Validate whether the given item name already exists on the storage.
    await this.validateItemNameUniquiness(tenantId, itemDTO.name);

    if (itemDTO.categoryId) {
      await this.validateItemCategoryExistance(tenantId, itemDTO.categoryId);
    }
    if (itemDTO.sellAccountId) {
      await this.validateItemSellAccountExistance(
        tenantId,
        itemDTO.sellAccountId
      );
    }
    if (itemDTO.costAccountId) {
      await this.validateItemCostAccountExistance(
        tenantId,
        itemDTO.costAccountId
      );
    }
    if (itemDTO.inventoryAccountId) {
      await this.validateItemInventoryAccountExistance(
        tenantId,
        itemDTO.inventoryAccountId
      );
    }
    const item = await Item.query().insertAndFetch({
      ...itemDTO,
      active: defaultTo(itemDTO.active, 1),
      quantityOnHand:
        itemDTO.type === 'inventory'
          ? defaultTo(itemDTO.openingQuantity, 0)
          : null,
    });
    this.logger.info('[items] item inserted successfully.', {
      tenantId,
      itemDTO,
    });
    // Triggers `onItemCreated` event.
    await this.eventDispatcher.dispatch(events.item.onCreated, {
      tenantId,
      item,
      itemId: item.id,
    });
    return item;
  }

  /**
   * Records the opening items inventory transaction.
   * @param {number} tenantId -
   * @param itemId -
   * @param openingQuantity -
   * @param openingCost -
   * @param openingDate -
   */
  public async recordOpeningItemsInventoryTransaction(
    tenantId: number,
    itemId: number,
    openingQuantity: number,
    openingCost: number,
    openingDate: Date
  ): Promise<void> {
    // Gets the next inventory lot number.
    const lotNumber = this.inventoryService.getNextLotNumber(tenantId);

    // Records the inventory transaction.
    const inventoryTransaction = await this.inventoryService.recordInventoryTransaction(
      tenantId,
      {
        date: openingDate,
        quantity: openingQuantity,
        rate: openingCost,
        direction: 'IN',
        transactionType: 'OpeningItem',
        itemId,
        lotNumber,
      }
    );
    // Records the inventory cost lot transaction.
    await this.inventoryService.recordInventoryCostLotTransaction(tenantId, {
      ...omit(inventoryTransaction, ['updatedAt', 'createdAt']),
      cost: openingQuantity * openingCost,
      remaining: 0,
    });
    await this.inventoryService.incrementNextLotNumber(tenantId);
  }

  /**
   * Edits the item metadata.
   * @param {number} tenantId
   * @param {number} itemId
   * @param {IItemDTO} itemDTO
   */
  public async editItem(tenantId: number, itemId: number, itemDTO: IItemDTO) {
    const { Item } = this.tenancy.models(tenantId);

    // Validates the given item existance on the storage.
    const oldItem = await this.getItemOrThrowError(tenantId, itemId);

    // Validate the item category existance on the storage,
    if (itemDTO.categoryId) {
      await this.validateItemCategoryExistance(tenantId, itemDTO.categoryId);
    }
    // Validate the sell account existance on the storage.
    if (itemDTO.sellAccountId) {
      await this.validateItemSellAccountExistance(
        tenantId,
        itemDTO.sellAccountId
      );
    }
    // Validate the cost account existance on the storage.
    if (itemDTO.costAccountId) {
      await this.validateItemCostAccountExistance(
        tenantId,
        itemDTO.costAccountId
      );
    }
    // Validate the inventory account existance onthe storage.
    if (itemDTO.inventoryAccountId) {
      await this.validateItemInventoryAccountExistance(
        tenantId,
        itemDTO.inventoryAccountId
      );
    }

    const newItem = await Item.query().patchAndFetchById(itemId, {
      ...itemDTO,
    });
    this.logger.info('[items] item edited successfully.', {
      tenantId,
      itemId,
      itemDTO,
    });

    return newItem;
  }

  /**
   * Delete the given item from the storage.
   * @param {number} tenantId - Tenant id.
   * @param {number} itemId - Item id.
   * @return {Promise<void>}
   */
  public async deleteItem(tenantId: number, itemId: number) {
    const { Item } = this.tenancy.models(tenantId);

    this.logger.info('[items] trying to delete item.', { tenantId, itemId });
    await this.getItemOrThrowError(tenantId, itemId);
    await this.validateHasNoInvoicesOrBills(tenantId, itemId);

    await Item.query().findById(itemId).delete();
    this.logger.info('[items] deleted successfully.', { tenantId, itemId });
  }

  /**
   * Activates the given item on the storage.
   * @param {number} tenantId -
   * @param {number} itemId -
   * @return {Promise<void>}
   */
  public async activateItem(tenantId: number, itemId: number): Promise<void> {
    const { Item } = this.tenancy.models(tenantId);

    this.logger.info('[items] trying to activate the given item.', {
      tenantId,
      itemId,
    });
    const item = await this.getItemOrThrowError(tenantId, itemId);

    await Item.query().findById(itemId).patch({ active: true });

    this.logger.info('[items] activated successfully.', { tenantId, itemId });
  }

  /**
   * Inactivates the given item on the storage.
   * @param {number} tenantId
   * @param {number} itemId
   * @return {Promise<void>}
   */
  public async inactivateItem(tenantId: number, itemId: number): Promise<void> {
    const { Item } = this.tenancy.models(tenantId);

    this.logger.info('[items] trying to inactivate the given item.', {
      tenantId,
      itemId,
    });
    const item = await this.getItemOrThrowError(tenantId, itemId);

    await Item.query().findById(itemId).patch({ active: false });

    this.logger.info('[items] activated successfully.', { tenantId, itemId });
  }

  /**
   * Retrieve the item details of the given id with associated details.
   * @param {number} tenantId
   * @param {number} itemId
   */
  public async getItem(tenantId: number, itemId: number): Promise<IItem> {
    const { Item } = this.tenancy.models(tenantId);

    this.logger.info('[items] trying to get the specific item.', {
      tenantId,
      itemId,
    });

    const item = await Item.query()
      .findById(itemId)
      .withGraphFetched(
        'costAccount',
        'sellAccount',
        'inventoryAccount',
        'category'
      );

    if (!item) {
      throw new ServiceError(ERRORS.NOT_FOUND);
    }
    return item;
  }

  /**
   * Validates the given items IDs exists or not returns the not found ones.
   * @param  {Array} itemsIDs
   * @return {Array}
   */
  private async validateItemsIdsExists(tenantId: number, itemsIDs: number[]) {
    const { Item } = this.tenancy.models(tenantId);

    const storedItems = await Item.query().whereIn('id', itemsIDs);
    const storedItemsIds = storedItems.map((t: IItem) => t.id);

    const notFoundItemsIds = difference(itemsIDs, storedItemsIds);
    return notFoundItemsIds;
  }

  /**
   * Deletes items in bulk.
   * @param {number} tenantId
   * @param {number[]} itemsIds - Items ids.
   */
  public async bulkDeleteItems(tenantId: number, itemsIds: number[]) {
    const { Item } = this.tenancy.models(tenantId);

    this.logger.info('[items] trying to delete items in bulk.', {
      tenantId,
      itemsIds,
    });
    await this.validateItemsIdsExists(tenantId, itemsIds);
    await this.validateHasNoInvoicesOrBills(tenantId, itemsIds);

    await Item.query().whereIn('id', itemsIds).delete();
    this.logger.info('[items] deleted successfully in bulk.', {
      tenantId,
      itemsIds,
    });
  }

  /**
   * Retrieve items datatable list.
   * @param {number} tenantId
   * @param {IItemsFilter} itemsFilter
   */
  public async itemsList(tenantId: number, itemsFilter: IItemsFilter) {
    const { Item } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      Item,
      itemsFilter
    );

    const { results, pagination } = await Item.query()
      .onBuild((builder) => {
        builder.withGraphFetched('inventoryAccount');
        builder.withGraphFetched('sellAccount');
        builder.withGraphFetched('costAccount');
        builder.withGraphFetched('category');

        dynamicFilter.buildQuery()(builder);
      })
      .pagination(itemsFilter.page - 1, itemsFilter.pageSize);
    return {
      items: results,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Validates the given item or items have no associated invoices or bills.
   * @param  {number} tenantId - Tenant id.
   * @param  {number|number[]} itemId - Item id.
   * @throws {ServiceError}
   */
  private async validateHasNoInvoicesOrBills(
    tenantId: number,
    itemId: number[] | number
  ) {
    const { ItemEntry } = this.tenancy.models(tenantId);

    const ids = Array.isArray(itemId) ? itemId : [itemId];
    const foundItemEntries = await ItemEntry.query()
      .whereIn('item_id', ids)
      .whereIn('reference_type', ['SaleInvoice', 'Bill']);

    if (foundItemEntries.length > 0) {
      throw new ServiceError(
        ids.length > 1
          ? ERRORS.ITEMS_HAVE_ASSOCIATED_TRANSACTIONS
          : ERRORS.ITEM_HAS_ASSOCIATED_TRANSACTINS
      );
    }
  }
}
