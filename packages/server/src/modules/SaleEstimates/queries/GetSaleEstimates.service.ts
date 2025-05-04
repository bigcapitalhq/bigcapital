import * as R from 'ramda';
import { SaleEstimateTransfromer } from './SaleEstimate.transformer';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { SaleEstimate } from '../models/SaleEstimate';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { ISalesEstimatesFilter } from '../types/SaleEstimates.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetSaleEstimatesService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(SaleEstimate.name)
    private readonly saleEstimateModel: TenantModelProxy<typeof SaleEstimate>,
  ) {}

  /**
   * Retrieves estimates filterable and paginated list.
   * @param {IEstimatesFilter} estimatesFilter -
   */
  public async getEstimates(
    filterDTO: Partial<ISalesEstimatesFilter>,
  ): Promise<{
    salesEstimates: SaleEstimate[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const _filterDto = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...filterDTO,
    };
    // Parses filter DTO.
    const filter = this.parseListFilterDTO(_filterDto);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      SaleEstimate,
      filter,
    );
    const { results, pagination } = await this.saleEstimateModel()
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('customer');
        builder.withGraphFetched('entries');
        builder.withGraphFetched('entries.item');

        dynamicFilter.buildQuery()(builder);
        _filterDto?.filterQuery && _filterDto?.filterQuery(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    const transformedEstimates = await this.transformer.transform(
      results,
      new SaleEstimateTransfromer(),
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
