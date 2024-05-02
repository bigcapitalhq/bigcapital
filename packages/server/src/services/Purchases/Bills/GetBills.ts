import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import {
  IBill,
  IBillsFilter,
  IFilterMeta,
  IPaginationMeta,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { PurchaseInvoiceTransformer } from './PurchaseInvoiceTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';

@Service()
export class GetBills {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private transformer: TransformerInjectable;

  @Inject()
  private dynamicListService: DynamicListingService;

  /**
   * Retrieve bills data table list.
   * @param {number} tenantId -
   * @param {IBillsFilter} billsFilter -
   */
  public async getBills(
    tenantId: number,
    filterDTO: IBillsFilter
  ): Promise<{
    bills: IBill;
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { Bill } = this.tenancy.models(tenantId);

    // Parses bills list filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      Bill,
      filter
    );
    const { results, pagination } = await Bill.query()
      .onBuild((builder) => {
        builder.withGraphFetched('vendor');
        builder.withGraphFetched('entries.item');
        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Tranform the bills to POJO.
    const bills = await this.transformer.transform(
      tenantId,
      results,
      new PurchaseInvoiceTransformer()
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
