import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import {
  IFilterMeta,
  IPaginationMeta,
  ISaleEstimate,
  ISalesEstimatesFilter,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { SaleEstimateDTOTransformer } from './SaleEstimateDTOTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetSaleEstimates {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Parses the sale receipts list filter DTO.
   * @param filterDTO
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieves estimates filterable and paginated list.
   * @param {number} tenantId -
   * @param {IEstimatesFilter} estimatesFilter -
   */
  public async estimatesList(
    tenantId: number,
    filterDTO: ISalesEstimatesFilter
  ): Promise<{
    salesEstimates: ISaleEstimate[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { SaleEstimate } = this.tenancy.models(tenantId);

    // Parses filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      SaleEstimate,
      filter
    );
    const { results, pagination } = await SaleEstimate.query()
      .onBuild((builder) => {
        builder.withGraphFetched('customer');
        builder.withGraphFetched('entries');
        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    const transformedEstimates = await this.transformer.transform(
      tenantId,
      results,
      new SaleEstimateDTOTransformer()
    );
    return {
      salesEstimates: transformedEstimates,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }
}
