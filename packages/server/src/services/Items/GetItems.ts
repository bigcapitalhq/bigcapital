import { Service, Inject } from 'typedi';
import * as R from 'ramda';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { IItemsFilter } from '@/interfaces';
import ItemTransformer from './ItemTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetItems {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Parses items list filter DTO.
   * @param {} filterDTO - Filter DTO.
   */
  private parseItemsListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve items datatable list.
   * @param {number} tenantId -
   * @param {IItemsFilter} itemsFilter -
   */
  public async getItems(tenantId: number, filterDTO: IItemsFilter) {
    const { Item } = this.tenancy.models(tenantId);

    // Parses items list filter DTO.
    const filter = this.parseItemsListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      Item,
      filter
    );
    const { results: items, pagination } = await Item.query()
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
      tenantId,
      items,
      new ItemTransformer()
    );
    return {
      items: transformedItems,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }
}
