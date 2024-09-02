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
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import { SaleEstimateDTOTransformer } from './SaleEstimateDTOTransformer';
import { SaleEstimateTransfromer } from './SaleEstimateTransformer';

@Service()
export class GetSaleEstimates {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieves estimates filterable and paginated list.
   * @param {number} tenantId -
   * @param {IEstimatesFilter} estimatesFilter -
   */
  public async getEstimates(
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
        builder.withGraphFetched('entries.item'); 
        dynamicFilter.buildQuery()(builder);
        filterDTO?.filterQuery && filterDTO?.filterQuery(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    const transformedEstimates = await this.transformer.transform(
      tenantId,
      results,
      new SaleEstimateTransfromer()
    );
    return {
      salesEstimates: transformedEstimates,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Parses the sale receipts list filter DTO.
   * @param filterDTO
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
