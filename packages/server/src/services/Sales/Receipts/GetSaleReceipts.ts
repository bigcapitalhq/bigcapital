import * as R from 'ramda';
import {
  IFilterMeta,
  IPaginationMeta,
  ISaleReceipt,
  ISalesReceiptsFilter,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { SaleReceiptTransformer } from './SaleReceiptTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';

interface GetSaleReceiptsSettings {
  fetchEntriesGraph?: boolean;
}
@Service()
export class GetSaleReceipts {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private dynamicListService: DynamicListingService;

  /**
   * Retrieve sales receipts paginated and filterable list.
   * @param {number} tenantId
   * @param {ISaleReceiptFilter} salesReceiptsFilter
   */
  public async getSaleReceipts(
    tenantId: number,
    filterDTO: ISalesReceiptsFilter
  ): Promise<{
    data: ISaleReceipt[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { SaleReceipt } = this.tenancy.models(tenantId);

    // Parses the stringified filter roles.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      SaleReceipt,
      filter
    );
    const { results, pagination } = await SaleReceipt.query()
      .onBuild((builder) => {
        builder.withGraphFetched('depositAccount');
        builder.withGraphFetched('customer');
        builder.withGraphFetched('entries.item');

        dynamicFilter.buildQuery()(builder);
        filterDTO?.filterQuery && filterDTO?.filterQuery(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformes the estimates models to POJO.
    const salesEstimates = await this.transformer.transform(
      tenantId,
      results,
      new SaleReceiptTransformer()
    );
    return {
      data: salesEstimates,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Parses the sale invoice list filter DTO.
   * @param filterDTO
   * @returns
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
