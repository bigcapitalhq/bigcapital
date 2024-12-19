import { Inject, Injectable } from '@nestjs/common';
import { ItemCategory } from '../models/ItemCategory.model';

@Injectable()
export class GetItemCategoryService {
  constructor(
    @Inject(ItemCategory.name)
    private readonly itemCategoryModel: typeof ItemCategory,
  ) {}

  /**
   * Retrieves item category by id.
   * @param {number} itemCategoryId
   * @returns {Promise<IItemCategory>}
   */
  public async getItemCategory(itemCategoryId: number) {
    const itemCategory = await this.itemCategoryModel
      .query()
      .findById(itemCategoryId)
      .throwIfNotFound();

    return itemCategory;
  }
}
