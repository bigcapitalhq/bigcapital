import { IBillPayment, IBillPaymentsFilter, IFilterMeta, IPaginationMeta } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import { BillPaymentTransformer } from './BillPaymentTransformer';

@Service()
export class GetBillPayments {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve bill payment paginted and filterable list.
   * @param {number} tenantId
   * @param {IBillPaymentsFilter} billPaymentsFilter
   */
  public async getBillPayments(
    tenantId: number,
    filterDTO: IBillPaymentsFilter,
  ): Promise<{
    billPayments: IBillPayment;
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { BillPayment } = this.tenancy.models(tenantId);

    // Parses filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(tenantId, BillPayment, filter);
    const { results, pagination } = await BillPayment.query()
      .onBuild((builder) => {
        builder.withGraphFetched('vendor');
        builder.withGraphFetched('paymentAccount');

        dynamicList.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformes the bill payments models to POJO.
    const billPayments = await this.transformer.transform(tenantId, results, new BillPaymentTransformer());
    return {
      billPayments,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }

  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
