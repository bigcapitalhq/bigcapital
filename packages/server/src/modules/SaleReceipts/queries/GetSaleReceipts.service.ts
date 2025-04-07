import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { SaleReceiptTransformer } from './SaleReceiptTransformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { ISalesReceiptsFilter } from '../types/SaleReceipts.types';
import { SaleReceipt } from '../models/SaleReceipt';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

interface GetSaleReceiptsSettings {
  fetchEntriesGraph?: boolean;
}
@Injectable()
export class GetSaleReceiptsService {
  constructor(
    private readonly transformer: TransformerInjectable,
    private readonly dynamicListService: DynamicListService,

    @Inject(SaleReceipt.name)
    private readonly saleReceiptModel: TenantModelProxy<typeof SaleReceipt>,
  ) {}

  /**
   * Retrieve sales receipts paginated and filterable list.
   * @param {ISalesReceiptsFilter} salesReceiptsFilter - Sales receipts filter.
   */
  public async getSaleReceipts(filterDTO: ISalesReceiptsFilter): Promise<{
    data: SaleReceipt[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    // Parses the stringified filter roles.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      SaleReceipt,
      filter,
    );
    const { results, pagination } = await this.saleReceiptModel()
      .query()
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
      results,
      new SaleReceiptTransformer(),
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
