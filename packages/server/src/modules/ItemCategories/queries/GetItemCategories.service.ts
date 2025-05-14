import * as R from 'ramda';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { ItemCategory } from '../models/ItemCategory.model';
import { Inject } from '@nestjs/common';
import {
  GetItemCategoriesResponse,
  IItemCategoriesFilter,
} from '../ItemCategory.interfaces';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { ISortOrder } from '@/modules/DynamicListing/DynamicFilter/DynamicFilter.types';

export class GetItemCategoriesService {
  constructor(
    private readonly dynamicListService: DynamicListService,

    @Inject(ItemCategory.name)
    private readonly itemCategoryModel: TenantModelProxy<typeof ItemCategory>,
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
   * @param {IItemCategoriesFilter} filterDTO
   * @returns {Promise<GetItemCategoriesResponse>}
   */
  public async getItemCategories(
    filterDto: Partial<IItemCategoriesFilter>,
  ): Promise<GetItemCategoriesResponse> {
    const _filterDto = {
      sortOrder: ISortOrder.ASC,
      columnSortBy: 'created_at',
      ...filterDto,
    };
    // Parses list filter DTO.
    const filter = this.parsesListFilterDTO(_filterDto);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      this.itemCategoryModel(),
      filter,
    );
    // Items categories.
    const data = await this.itemCategoryModel()
      .query()
      .onBuild((query) => {
        // Subquery to calculate sumation of associated items to the item category.
        query.select(
          '*',
          this.itemCategoryModel().relatedQuery('items').count().as('count'),
        );
        dynamicList.buildQuery()(query);
      });
    return { data };
  }
}
