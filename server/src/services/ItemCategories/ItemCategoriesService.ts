import { Inject } from 'typedi';
import { difference } from 'lodash';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';
import { ServiceError } from 'exceptions';
import {
  IItemCategory,
  IItemCategoryOTD,
  IItemCategoriesService,
  IItemCategoriesFilter,
  ISystemUser,
  IFilterMeta,
} from "interfaces";
import DynamicListingService from 'services/DynamicListing/DynamicListService';
import TenancyService from 'services/Tenancy/TenancyService';
import events from 'subscribers/events';

const ERRORS = {
  ITEM_CATEGORIES_NOT_FOUND: 'ITEM_CATEGORIES_NOT_FOUND',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  COST_ACCOUNT_NOT_FOUMD: 'COST_ACCOUNT_NOT_FOUMD',
  COST_ACCOUNT_NOT_COGS: 'COST_ACCOUNT_NOT_COGS',
  SELL_ACCOUNT_NOT_INCOME: 'SELL_ACCOUNT_NOT_INCOME',
  SELL_ACCOUNT_NOT_FOUND: 'SELL_ACCOUNT_NOT_FOUND',
  INVENTORY_ACCOUNT_NOT_FOUND: 'INVENTORY_ACCOUNT_NOT_FOUND',
  INVENTORY_ACCOUNT_NOT_INVENTORY: 'INVENTORY_ACCOUNT_NOT_INVENTORY',
  CATEGORY_HAVE_ITEMS: 'CATEGORY_HAVE_ITEMS'
};

export default class ItemCategoriesService implements IItemCategoriesService {
  @Inject()
  tenancy: TenancyService;

  @Inject()
  dynamicListService: DynamicListingService;

  @Inject('logger')
  logger: any;

  @EventDispatcher()
  eventDispatcher: EventDispatcherInterface;

  /**
   * Retrieve item category or throw not found error.
   * @param {number} tenantId 
   * @param {number} itemCategoryId 
   */
  private async getItemCategoryOrThrowError(tenantId: number, itemCategoryId: number) {
    const { ItemCategory } = this.tenancy.models(tenantId);
    const category = await ItemCategory.query().findById(itemCategoryId);

    if (!category) {
      throw new ServiceError(ERRORS.CATEGORY_NOT_FOUND)
    }
    return category;
  }

  /**
   * Transforms OTD to model object.
   * @param {IItemCategoryOTD} itemCategoryOTD 
   * @param {ISystemUser} authorizedUser 
   */
  private transformOTDToObject(itemCategoryOTD: IItemCategoryOTD, authorizedUser: ISystemUser) {
    return { ...itemCategoryOTD, userId: authorizedUser.id };
  }

  /**
   * Retrieve item category of the given id.
   * @param {number} tenantId -
   * @param {number} itemCategoryId -
   * @returns {IItemCategory}
   */
  public async getItemCategory(tenantId: number, itemCategoryId: number, user: ISystemUser) {
    return this.getItemCategoryOrThrowError(tenantId, itemCategoryId);
  }

  /**
   * Inserts a new item category.
   * @param {number} tenantId 
   * @param {IItemCategoryOTD} itemCategoryOTD 
   * @return {Promise<void>}
   */
  public async newItemCategory(
    tenantId: number,
    itemCategoryOTD: IItemCategoryOTD,
    authorizedUser: ISystemUser
  ): Promise<IItemCategory> {
    const { ItemCategory } = this.tenancy.models(tenantId);
    this.logger.info('[item_category] trying to insert a new item category.', { tenantId });

    if (itemCategoryOTD.sellAccountId) {
      await this.validateSellAccount(tenantId, itemCategoryOTD.sellAccountId);
    }
    if (itemCategoryOTD.costAccountId) {
      await this.validateCostAccount(tenantId, itemCategoryOTD.costAccountId);
    }
    if (itemCategoryOTD.inventoryAccountId) {
      await this.validateInventoryAccount(tenantId, itemCategoryOTD.inventoryAccountId);
    }

    const itemCategoryObj = this.transformOTDToObject(itemCategoryOTD, authorizedUser);
    const itemCategory = await ItemCategory.query().insert({ ...itemCategoryObj });

    await this.eventDispatcher.dispatch(events.items.onCreated);
    this.logger.info('[item_category] item category inserted successfully.', { tenantId, itemCategoryOTD });

    return itemCategory;
  }

  /**
   * Validates sell account existance and type.
   * @param {number} tenantId - Tenant id.
   * @param {number} sellAccountId - Sell account id.
   * @return {Promise<void>}
   */
  private async validateSellAccount(tenantId: number, sellAccountId: number) {
    const { accountRepository, accountTypeRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[items] validate sell account existance.', { tenantId, sellAccountId });
    const incomeType = await accountTypeRepository.getByKey('income');
    const foundAccount = await accountRepository.findById(sellAccountId);

    if (!foundAccount) {
      this.logger.info('[items] sell account not found.', { tenantId, sellAccountId });
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_FOUND)
    } else if (foundAccount.accountTypeId !== incomeType.id) {
      this.logger.info('[items] sell account not income type.', { tenantId, sellAccountId });
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_INCOME);
    }
  }

  /**
   * Validates COGS account existance and type.
   * @param {number} tenantId -
   * @param {number} costAccountId -
   * @return {Promise<void>}
   */
  private async validateCostAccount(tenantId: number, costAccountId: number) {
    const { accountRepository, accountTypeRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[items] validate cost account existance.', { tenantId, costAccountId });
    const COGSType = await accountTypeRepository.getByKey('cost_of_goods_sold');
    const foundAccount = await accountRepository.findById(costAccountId)

    if (!foundAccount) {
      this.logger.info('[items] cost account not found.', { tenantId, costAccountId });
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_FOUMD);
    } else if (foundAccount.accountTypeId !== COGSType.id) {
      this.logger.info('[items] validate cost account not COGS type.', { tenantId, costAccountId });
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_COGS);
    }
  }

  /**
   * Validates inventory account existance and type.
   * @param {number} tenantId 
   * @param {number} inventoryAccountId 
   * @return {Promise<void>}
   */
  private async validateInventoryAccount(tenantId: number, inventoryAccountId: number) {
    const { accountTypeRepository, accountRepository } = this.tenancy.repositories(tenantId);

    this.logger.info('[items] validate inventory account existance.', { tenantId, inventoryAccountId });
    const otherAsset = await accountTypeRepository.getByKey('other_asset');
    const foundAccount = await accountRepository.findById(inventoryAccountId);

    if (!foundAccount) {
      this.logger.info('[items] inventory account not found.', { tenantId, inventoryAccountId });
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_FOUND)
    } else if (otherAsset.id !== foundAccount.accountTypeId) {
      this.logger.info('[items] inventory account not inventory type.', { tenantId, inventoryAccountId });
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_INVENTORY);
    }
  }

  /**
   * Edits item category.
   * @param {number} tenantId 
   * @param {number} itemCategoryId 
   * @param {IItemCategoryOTD} itemCategoryOTD 
   * @return {Promise<void>}
   */
  public async editItemCategory(
    tenantId: number,
    itemCategoryId: number,
    itemCategoryOTD: IItemCategoryOTD,
    authorizedUser: ISystemUser,
  ): Promise<IItemCategory> {
    const { ItemCategory } = this.tenancy.models(tenantId);
    const oldItemCategory = await this.getItemCategoryOrThrowError(tenantId, itemCategoryId);

    if (itemCategoryOTD.sellAccountId) {       
      await this.validateSellAccount(tenantId, itemCategoryOTD.sellAccountId);
    }
    if (itemCategoryOTD.costAccountId) {
      await this.validateCostAccount(tenantId, itemCategoryOTD.costAccountId);
    }
    if (itemCategoryOTD.inventoryAccountId) {
      await this.validateInventoryAccount(tenantId, itemCategoryOTD.inventoryAccountId);
    }
    const itemCategoryObj = this.transformOTDToObject(itemCategoryOTD, authorizedUser);
    const itemCategory = await ItemCategory.query().patchAndFetchById(itemCategoryId, { ...itemCategoryObj });

    await this.eventDispatcher.dispatch(events.items.onEdited);
    this.logger.info('[item_category] edited successfully.', { tenantId, itemCategoryId, itemCategoryOTD });

    return itemCategory;
  }

  /**
   * Deletes the given item category.
   * @param {number} tenantId - Tenant id.
   * @param {number} itemCategoryId - Item category id.
   * @return {Promise<void>}
   */
  public async deleteItemCategory(tenantId: number, itemCategoryId: number, authorizedUser: ISystemUser) {
    this.logger.info('[item_category] trying to delete item category.', { tenantId, itemCategoryId });

    // Retrieve item category or throw not found error.
    await this.getItemCategoryOrThrowError(tenantId, itemCategoryId);

    // Unassociate items with item category.
    await this.unassociateItemsWithCategories(tenantId, itemCategoryId);

    const { ItemCategory } = this.tenancy.models(tenantId);
    await ItemCategory.query().findById(itemCategoryId).delete();
    this.logger.info('[item_category] deleted successfully.', { tenantId, itemCategoryId });

    await this.eventDispatcher.dispatch(events.items.onDeleted);
  }
 
  /**
   * Retrieve item categories or throw not found error.
   * @param {number} tenantId 
   * @param {number[]} itemCategoriesIds 
   */
  private async getItemCategoriesOrThrowError(tenantId: number, itemCategoriesIds: number[]) {
    const { ItemCategory } = this.tenancy.models(tenantId);
    const itemCategories = await ItemCategory.query().whereIn('id', itemCategoriesIds);

    const storedItemCategoriesIds = itemCategories.map((category: IItemCategory) => category.id);
    const notFoundCategories = difference(itemCategoriesIds, storedItemCategoriesIds);

    if (notFoundCategories.length > 0) {
      throw new ServiceError(ERRORS.ITEM_CATEGORIES_NOT_FOUND);
    }
  }
  
  /**
   * Retrieve item categories list.
   * @param {number} tenantId 
   * @param filter 
   */
  public async getItemCategoriesList(
    tenantId: number,
    filter: IItemCategoriesFilter,
    authorizedUser: ISystemUser
  ): Promise<{ itemCategories: IItemCategory[], filterMeta: IFilterMeta }> {
    const { ItemCategory } = this.tenancy.models(tenantId);
    const dynamicList = await this.dynamicListService.dynamicList(tenantId, ItemCategory, filter);

    const itemCategories = await ItemCategory.query().onBuild((query) => {
      // Subquery to calculate sumation of assocaited items to the item category.
      query.select('*', ItemCategory.relatedQuery('items').count().as('count'));

      dynamicList.buildQuery()(query);
    });
    return { itemCategories, filterMeta: dynamicList.getResponseMeta() };
  }

  /**
   * Unlink items relations with item categories.
   * @param {number} tenantId 
   * @param {number|number[]} itemCategoryId - 
   * @return {Promise<void>}
   */
  private async unassociateItemsWithCategories(
    tenantId: number,
    itemCategoryId: number | number[],
  ): Promise<void> {
    const { Item } = this.tenancy.models(tenantId);
    const ids = Array.isArray(itemCategoryId) ? itemCategoryId : [itemCategoryId];

    await Item.query().whereIn('category_id', ids).patch({ category_id: null });
  }

  /**
   * Deletes item categories in bulk.
   * @param {number} tenantId 
   * @param {number[]} itemCategoriesIds 
   */
  public async deleteItemCategories(
    tenantId: number,
    itemCategoriesIds: number[],
    authorizedUser: ISystemUser,
  ) {
    this.logger.info('[item_category] trying to delete item categories.', { tenantId, itemCategoriesIds });
    const { ItemCategory } = this.tenancy.models(tenantId);

    await this.getItemCategoriesOrThrowError(tenantId, itemCategoriesIds);
    await this.unassociateItemsWithCategories(tenantId, itemCategoriesIds);
 
    await ItemCategory.query().whereIn('id', itemCategoriesIds).delete();

    await this.eventDispatcher.dispatch(events.items.onBulkDeleted);
    this.logger.info('[item_category] item categories deleted successfully.', { tenantId, itemCategoriesIds });
  }
}