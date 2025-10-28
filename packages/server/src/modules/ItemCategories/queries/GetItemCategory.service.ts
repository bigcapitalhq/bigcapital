import { Inject, Injectable } from '@nestjs/common';
import { ItemCategory } from '../models/ItemCategory.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetItemCategoryService {
  /**
   * @param {typeof ItemCategory} itemCategoryModel - Item category model.
   */
  constructor(
    @Inject(ItemCategory.name)
    private readonly itemCategoryModel: TenantModelProxy<typeof ItemCategory>,
  ) {}

  /**
   * Retrieves item category by id.
   * @param {number} itemCategoryId
   * @returns {Promise<IItemCategory>}
   */
  public async getItemCategory(itemCategoryId: number) {
    const itemCategory = await this.itemCategoryModel()
      .query()
      .findById(itemCategoryId)
      .throwIfNotFound();

    return itemCategory;
  }
}
