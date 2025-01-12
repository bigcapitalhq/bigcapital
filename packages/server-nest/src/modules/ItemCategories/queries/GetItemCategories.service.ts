import * as R from 'ramda';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { ItemCategory } from '../models/ItemCategory.model';
import { Inject } from '@nestjs/common';

export class GetItemCategoriesService {
  constructor(
    private readonly dynamicListService: DynamicListService,

    @Inject(ItemCategory.name)
    private readonly itemCategoryModel: typeof ItemCategory,
  ) {}

  /**
   * Parses items categories filter DTO.
   * @param {} filterDTO
   * @returns
   */
  private parsesListFilterDTO(filterDTO) {
    return R.compose(
      // Parses stringified filter roles.
      this.dynamicListService.parseStringifiedFilter,
    )(filterDTO);
  }

  /**
   * Retrieve item categories list.
   * @param {number} tenantId
   * @param filter
   */
  public async getItemCategories(
    filterDTO: IItemCategoriesFilter,
  ): Promise<{ itemCategories: ItemCategory[]; filterMeta: IFilterMeta }> {
    // Parses list filter DTO.
    const filter = this.parsesListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      this.itemCategoryModel,
      filter,
    );
    // Items categories.
    const itemCategories = await this.itemCategoryModel
      .query()
      .onBuild((query) => {
        // Subquery to calculate sumation of associated items to the item category.
        query.select(
          '*',
          this.itemCategoryModel.relatedQuery('items').count().as('count'),
        );

        dynamicList.buildQuery()(query);
      });
    return { itemCategories, filterMeta: dynamicList.getResponseMeta() };
  }
}
