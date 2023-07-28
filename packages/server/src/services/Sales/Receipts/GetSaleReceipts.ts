import {
  IFilterMeta,
  IPaginationMeta,
  ISaleReceipt,
  ISalesReceiptsFilter,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { Inject, Service } from 'typedi';
import { SaleReceiptTransformer } from './SaleReceiptTransformer';
import { SaleReceiptDTOTransformer } from './SaleReceiptDTOTransformer';

@Service()
export class GetSaleReceipts {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: SaleReceiptDTOTransformer;

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
        builder.withGraphFetched('entries');

        dynamicFilter.buildQuery()(builder);
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
}
