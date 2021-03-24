import { defaultTo, difference } from 'lodash';
import { Service, Inject } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import events from 'subscribers/events';
import {
  IItemsFilter,
  IItemsService,
  IItemDTO,
  IItem,
  IItemsAutoCompleteFilter,
} from 'interfaces';
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import TenancyService from 'services/Tenancy/TenancyService';
import { ServiceError } from 'exceptions';
import InventoryService from 'services/Inventory/Inventory';
import {
  ACCOUNT_PARENT_TYPE,
  ACCOUNT_ROOT_TYPE,
  ACCOUNT_TYPE,
} from 'data/AccountTypes';
import { ERRORS } from './constants';
import { AccountTransaction } from 'models';

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
  public async getItemOrThrowError(
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
    const { accountRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[items] validate cost account existance.', {
      tenantId,
      costAccountId,
    });
    const foundAccount = await accountRepository.findOneById(costAccountId);

    if (!foundAccount) {
      this.logger.info('[items] cost account not found.', {
        tenantId,
        costAccountId,
      });
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_FOUMD);

      // Detarmines the cost of goods sold account.
    } else if (!foundAccount.isParentType(ACCOUNT_PARENT_TYPE.EXPENSE)) {
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
    const { accountRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[items] validate sell account existance.', {
      tenantId,
      sellAccountId,
    });

    const foundAccount = await accountRepository.findOneById(sellAccountId);

    if (!foundAccount) {
      this.logger.info('[items] sell account not found.', {
        tenantId,
        sellAccountId,
      });
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_FOUND);
    } else if (!foundAccount.isParentType(ACCOUNT_ROOT_TYPE.INCOME)) {
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
    const { accountRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[items] validate inventory account existance.', {
      tenantId,
      inventoryAccountId,
    });
    const foundAccount = await accountRepository.findOneById(
      inventoryAccountId
    );

    if (!foundAccount) {
      this.logger.info('[items] inventory account not found.', {
        tenantId,
        inventoryAccountId,
      });
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_FOUND);
    } else if (!foundAccount.isAccountType(ACCOUNT_TYPE.INVENTORY)) {
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
   * Transforms the item DTO to model.
   * @param  {IItemDTO} itemDTO - Item DTO.
   * @return {IItem}
   */
  private transformNewItemDTOToModel(itemDTO: IItemDTO) {
    return {
      ...itemDTO,
      active: defaultTo(itemDTO.active, 1),
      quantityOnHand: itemDTO.type === 'inventory' ? 0 : null,
    };
  }

  /**
   *
   * @param {IItemDTO} itemDTO - Item DTO.
   * @param {IItem} oldItem -
   */
  private transformEditItemDTOToModel(itemDTO: IItemDTO, oldItem: IItem) {
    return {
      ...itemDTO,
      ...(itemDTO.type === 'inventory' && oldItem.type !== 'inventory'
        ? {
            quantityOnHand: 0,
          }
        : {}),
    };
  }

  /**
   * Validate edit item type from inventory to another type that not allowed.
   * @param {IItemDTO} itemDTO
   * @param {IItem} oldItem
   */
  private validateEditItemFromInventory(itemDTO: IItemDTO, oldItem: IItem) {
    if (
      itemDTO.type &&
      oldItem.type === 'inventory' &&
      itemDTO.type !== oldItem.type
    ) {
      throw new ServiceError(ERRORS.ITEM_CANNOT_CHANGE_INVENTORY_TYPE);
    }
  }

  /**
   * Validates edit item type from service/non-inventory to inventory.
   * Should item has no any relations with accounts transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} itemId - Item id.
   */
  private async validateEditItemTypeToInventory(
    tenantId: number,
    oldItem: IItem,
    newItemDTO: IItemDTO
  ) {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    // We have no problem in case the item type not modified.
    if (newItemDTO.type === oldItem.type || oldItem.type === 'inventory') {
      return;
    }
    // Retrieve all transactions that associated to the given item id.
    const itemTransactionsCount = await AccountTransaction.query()
      .where('item_id', oldItem.id)
      .count('item_id', { as: 'transactions' })
      .first();

    if (itemTransactionsCount.transactions > 0) {
      throw new ServiceError(
        ERRORS.TYPE_CANNOT_CHANGE_WITH_ITEM_HAS_TRANSACTIONS
      );
    }
  }

  /**
   * Validate the item inventory account whether modified and item 
   * has assocaited inventory transactions.
   * @param {numnber} tenantId 
   * @param {IItem} oldItem 
   * @param {IItemDTO} newItemDTO 
   * @returns 
   */
  async validateItemInvnetoryAccountModified(
    tenantId: number,
    oldItem: IItem,
    newItemDTO: IItemDTO
  ) {
    const { AccountTransaction } = this.tenancy.models(tenantId);

    if (
      newItemDTO.type !== 'inventory' ||
      oldItem.inventoryAccountId === newItemDTO.inventoryAccountId
    ) {
      return;
    }
    // Inventory transactions associated to the given item id.
    const transactions = await AccountTransaction.query().where({
      itemId: oldItem.id,
    });
    // Throw the service error in case item has associated inventory transactions.
    if (transactions.length > 0) {
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_CANNOT_MODIFIED);
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
      ...this.transformNewItemDTOToModel(itemDTO),
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
   * Edits the item metadata.
   * @param {number} tenantId
   * @param {number} itemId
   * @param {IItemDTO} itemDTO
   */
  public async editItem(tenantId: number, itemId: number, itemDTO: IItemDTO) {
    const { Item } = this.tenancy.models(tenantId);

    // Validates the given item existance on the storage.
    const oldItem = await this.getItemOrThrowError(tenantId, itemId);

    // Validate edit item type from inventory type.
    this.validateEditItemFromInventory(itemDTO, oldItem);

    // Validate edit item type to inventory type.
    await this.validateEditItemTypeToInventory(tenantId, oldItem, itemDTO);

    // Transform the edit item DTO to model.
    const itemModel = this.transformEditItemDTOToModel(itemDTO, oldItem);

    // Validate whether the given item name already exists on the storage.
    await this.validateItemNameUniquiness(tenantId, itemDTO.name, itemId);

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

    await this.validateItemInvnetoryAccountModified(
      tenantId,
      oldItem,
      itemDTO
    );

    const newItem = await Item.query().patchAndFetchById(itemId, {
      ...itemModel,
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

    // Retreive the given item or throw not found service error.
    await this.getItemOrThrowError(tenantId, itemId);

    // Validate the item has no associated inventory transactions.
    await this.validateHasNoInventoryAdjustments(tenantId, itemId);

    // Validate the item has no associated invoices or bills.
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
   * Retrieve auto-complete items list.
   * @param {number} tenantId -
   * @param {IItemsAutoCompleteFilter} itemsFilter -
   */
  public async autocompleteItems(
    tenantId: number,
    itemsFilter: IItemsAutoCompleteFilter
  ) {
    const { Item } = this.tenancy.models(tenantId);
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      Item,
      itemsFilter
    );
    const items = await Item.query().onBuild((builder) => {
      builder.withGraphFetched('category');

      dynamicFilter.buildQuery()(builder);
      builder.limit(itemsFilter.limit);

      if (itemsFilter.keyword) {
        builder.where('name', 'LIKE', `%${itemsFilter.keyword}%`);
      }
    });
    return items;
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
    const foundItemEntries = await ItemEntry.query().whereIn('item_id', ids);

    if (foundItemEntries.length > 0) {
      throw new ServiceError(
        ids.length > 1
          ? ERRORS.ITEMS_HAVE_ASSOCIATED_TRANSACTIONS
          : ERRORS.ITEM_HAS_ASSOCIATED_TRANSACTINS
      );
    }
  }

  /**
   * Validates the given item has no associated inventory adjustment transactions.
   * @param {number} tenantId -
   * @param {number} itemId -
   */
  private async validateHasNoInventoryAdjustments(
    tenantId: number,
    itemId: number[] | number
  ): Promise<void> {
    const { InventoryAdjustmentEntry } = this.tenancy.models(tenantId);
    const itemsIds = Array.isArray(itemId) ? itemId : [itemId];

    const inventoryAdjEntries = await InventoryAdjustmentEntry.query().whereIn(
      'item_id',
      itemsIds
    );
    if (inventoryAdjEntries.length > 0) {
      throw new ServiceError(ERRORS.ITEM_HAS_ASSOCIATED_INVENTORY_ADJUSTMENT);
    }
  }
}
