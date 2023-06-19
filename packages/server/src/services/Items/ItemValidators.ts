import {
  ACCOUNT_PARENT_TYPE,
  ACCOUNT_ROOT_TYPE,
  ACCOUNT_TYPE,
} from '@/data/AccountTypes';
import { ServiceError } from '@/exceptions';
import { IItem, IItemDTO } from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { ERRORS } from './constants';

@Service()
export class ItemsValidators {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Validate wether the given item name already exists on the storage.
   * @param  {number} tenantId
   * @param  {string} itemName
   * @param  {number} notItemId
   * @return {Promise<void>}
   */
  public async validateItemNameUniquiness(
    tenantId: number,
    itemName: string,
    notItemId?: number
  ): Promise<void> {
    const { Item } = this.tenancy.models(tenantId);

    const foundItems: [] = await Item.query().onBuild((builder: any) => {
      builder.where('name', itemName);
      if (notItemId) {
        builder.whereNot('id', notItemId);
      }
    });
    if (foundItems.length > 0) {
      throw new ServiceError(ERRORS.ITEM_NAME_EXISTS);
    }
  }

  /**
   * Validate item COGS account existance and type.
   * @param {number} tenantId
   * @param {number} costAccountId
   * @return {Promise<void>}
   */
  public async validateItemCostAccountExistance(
    tenantId: number,
    costAccountId: number
  ): Promise<void> {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const foundAccount = await accountRepository.findOneById(costAccountId);

    if (!foundAccount) {
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_FOUMD);

      // Detarmines the cost of goods sold account.
    } else if (!foundAccount.isParentType(ACCOUNT_PARENT_TYPE.EXPENSE)) {
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_COGS);
    }
  }

  /**
   * Validate item sell account existance and type.
   * @param {number} tenantId - Tenant id.
   * @param {number} sellAccountId - Sell account id.
   */
  public async validateItemSellAccountExistance(
    tenantId: number,
    sellAccountId: number
  ) {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const foundAccount = await accountRepository.findOneById(sellAccountId);

    if (!foundAccount) {
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_FOUND);
    } else if (!foundAccount.isParentType(ACCOUNT_ROOT_TYPE.INCOME)) {
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_INCOME);
    }
  }

  /**
   * Validate item inventory account existance and type.
   * @param {number} tenantId
   * @param {number} inventoryAccountId
   */
  public async validateItemInventoryAccountExistance(
    tenantId: number,
    inventoryAccountId: number
  ) {
    const { accountRepository } = this.tenancy.repositories(tenantId);

    const foundAccount = await accountRepository.findOneById(
      inventoryAccountId
    );

    if (!foundAccount) {
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_FOUND);
    } else if (!foundAccount.isAccountType(ACCOUNT_TYPE.INVENTORY)) {
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_INVENTORY);
    }
  }

  /**
   * Validate item category existance.
   * @param {number} tenantId
   * @param {number} itemCategoryId
   */
  public async validateItemCategoryExistance(
    tenantId: number,
    itemCategoryId: number
  ) {
    const { ItemCategory } = this.tenancy.models(tenantId);
    const foundCategory = await ItemCategory.query().findById(itemCategoryId);

    if (!foundCategory) {
      throw new ServiceError(ERRORS.ITEM_CATEGORY_NOT_FOUND);
    }
  }

  /**
   * Validates the given item or items have no associated invoices or bills.
   * @param  {number} tenantId - Tenant id.
   * @param  {number|number[]} itemId - Item id.
   * @throws {ServiceError}
   */
  public async validateHasNoInvoicesOrBills(
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
  public async validateHasNoInventoryAdjustments(
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

  /**
   * Validates edit item type from service/non-inventory to inventory.
   * Should item has no any relations with accounts transactions.
   * @param {number} tenantId - Tenant id.
   * @param {number} itemId - Item id.
   */
  public async validateEditItemTypeToInventory(
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
   * has associated inventory transactions.
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
   * Validate edit item type from inventory to another type that not allowed.
   * @param {IItemDTO} itemDTO - Item DTO.
   * @param {IItem} oldItem - Old item.
   */
  public validateEditItemFromInventory(itemDTO: IItemDTO, oldItem: IItem) {
    if (
      itemDTO.type &&
      oldItem.type === 'inventory' &&
      itemDTO.type !== oldItem.type
    ) {
      throw new ServiceError(ERRORS.ITEM_CANNOT_CHANGE_INVENTORY_TYPE);
    }
  }
}
