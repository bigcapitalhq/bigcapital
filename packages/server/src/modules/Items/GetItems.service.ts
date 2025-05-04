import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { DynamicListService } from '../DynamicListing/DynamicList.service';
import { Item } from './models/Item';
import { IItemsFilter } from './types/Items.types';
import { ItemTransformer } from './Item.transformer';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { ISortOrder } from '../DynamicListing/DynamicFilter/DynamicFilter.types';

@Injectable()
export class GetItemsService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(Item.name)
    private readonly itemModel: TenantModelProxy<typeof Item>,
  ) {}

  /**
   * Parses items list filter DTO.
   * @param {} filterDTO - Filter DTO.
   */
  private parseItemsListFilterDTO(filterDTO: IItemsFilter) {
    return R.compose(
      this.dynamicListService.parseStringifiedFilter<IItemsFilter>,
    )(filterDTO);
  }

  /**
   * Retrieves items datatable list.
   * @param {IItemsFilter} itemsFilter - Items filter.
   */
  public async getItems(filterDto: Partial<IItemsFilter>) {
    const _filterDto = {
      sortOrder: ISortOrder.DESC,
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      inactiveMode: false,
      ...filterDto,
    };
    // Parses items list filter DTO.
    const filter = this.parseItemsListFilterDTO(_filterDto);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      Item,
      filter,
    );
    const { results: items, pagination } = await this.itemModel()
      .query()
      .onBuild((builder) => {
        builder.modify('inactiveMode', filter.inactiveMode);

        builder.withGraphFetched('inventoryAccount');
        builder.withGraphFetched('sellAccount');
        builder.withGraphFetched('costAccount');
        builder.withGraphFetched('category');

        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed items.
    const transformedItems = await this.transformer.transform(
      items,
      new ItemTransformer(),
    );
    return {
      items: transformedItems,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }
}
