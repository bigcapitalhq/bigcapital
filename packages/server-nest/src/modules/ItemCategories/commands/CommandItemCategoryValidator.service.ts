import { Account } from '@/modules/Accounts/models/Account.model';
import { ItemCategory } from '../models/ItemCategory.model';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';
import { ACCOUNT_ROOT_TYPE, ACCOUNT_TYPE } from '@/constants/accounts';

@Injectable()
export class CommandItemCategoryValidatorService {
  /**
   * @param {typeof ItemCategory} itemCategoryModel - Item category model.
   * @param {typeof Account} accountModel - Account model.
   */
  constructor(
    @Inject(ItemCategory.name)
    private readonly itemCategoryModel: typeof ItemCategory,

    @Inject(Account.name)
    private readonly accountModel: typeof Account,
  ) {}

  /**
   * Validates the category name uniquiness.
   * @param {string} categoryName - Category name.
   * @param {number} notAccountId - Ignore the account id.
   */
  public async validateCategoryNameUniquiness(
    categoryName: string,
    notCategoryId?: number,
  ) {
    const foundItemCategory = await this.itemCategoryModel
      .query()
      .findOne('name', categoryName)
      .onBuild((query) => {
        if (notCategoryId) {
          query.whereNot('id', notCategoryId);
        }
      });

    if (foundItemCategory) {
      throw new ServiceError(
        ERRORS.CATEGORY_NAME_EXISTS,
        'The item category name is already exist.',
      );
    }
  }

  /**
   * Validates sell account existance and type.
   * @param {number} sellAccountId - Sell account id.
   * @return {Promise<void>}
   */
  public async validateSellAccount(sellAccountId: number) {
    const foundAccount = await this.accountModel
      .query()
      .findById(sellAccountId);

    if (!foundAccount) {
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_FOUND);
    } else if (!foundAccount.isRootType(ACCOUNT_ROOT_TYPE.INCOME)) {
      throw new ServiceError(ERRORS.SELL_ACCOUNT_NOT_INCOME);
    }
  }

  /**
   * Validates COGS account existance and type.
   * @param {number} costAccountId -
   * @return {Promise<void>}
   */
  public async validateCostAccount(costAccountId: number) {
    const foundAccount = await this.accountModel
      .query()
      .findById(costAccountId);

    if (!foundAccount) {
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_FOUMD);
    } else if (!foundAccount.isRootType(ACCOUNT_ROOT_TYPE.EXPENSE)) {
      throw new ServiceError(ERRORS.COST_ACCOUNT_NOT_COGS);
    }
  }

  /**
   * Validates inventory account existance and type.
   * @param {number} inventoryAccountId
   * @return {Promise<void>}
   */
  public async validateInventoryAccount(inventoryAccountId: number) {
    const foundAccount = await this.accountModel
      .query()
      .findById(inventoryAccountId);

    if (!foundAccount) {
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_FOUND);
    } else if (!foundAccount.isAccountType(ACCOUNT_TYPE.INVENTORY)) {
      throw new ServiceError(ERRORS.INVENTORY_ACCOUNT_NOT_INVENTORY);
    }
  }
}
