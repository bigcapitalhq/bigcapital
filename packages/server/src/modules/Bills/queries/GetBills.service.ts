import { Inject, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { Bill } from '../models/Bill';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { BillTransformer } from './Bill.transformer';
import { IBillsFilter } from '../Bills.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetBillsService {
  constructor(
    private transformer: TransformerInjectable,
    private dynamicListService: DynamicListService,

    @Inject(Bill.name) private billModel: TenantModelProxy<typeof Bill>,
  ) {}

  /**
   * Retrieve bills data table list.
   * @param {IBillsFilter} billsFilter -
   */
  public async getBills(filterDTO: Partial<IBillsFilter>): Promise<{
    bills: Bill;
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const _filterDto = {
      page: 1,
      pageSize: 12,
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...filterDTO,
    };
    // Parses bills list filter DTO.
    const filter = this.parseListFilterDTO(_filterDto);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      this.billModel(),
      filter,
    );
    const { results, pagination } = await this.billModel()
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('vendor');
        builder.withGraphFetched('entries.item');
        dynamicFilter.buildQuery()(builder);

        // Filter query.
        _filterDto?.filterQuery && _filterDto?.filterQuery(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Tranform the bills to POJO.
    const bills = await this.transformer.transform(
      results,
      new BillTransformer(),
    );
    return {
      bills,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Parses bills list filter DTO.
   * @param filterDTO -
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
