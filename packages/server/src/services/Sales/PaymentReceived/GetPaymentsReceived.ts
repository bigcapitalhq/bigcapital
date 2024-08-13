import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import {
  IFilterMeta,
  IPaginationMeta,
  IPaymentReceived,
  IPaymentsReceivedFilter,
} from '@/interfaces';
import { PaymentReceiveTransfromer } from './PaymentReceivedTransformer';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';

@Service()
export class GetPaymentReceives {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve payment receives paginated and filterable list.
   * @param {number} tenantId
   * @param {IPaymentsReceivedFilter} paymentReceivesFilter
   */
  public async getPaymentReceives(
    tenantId: number,
    filterDTO: IPaymentsReceivedFilter
  ): Promise<{
    paymentReceives: IPaymentReceived[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { PaymentReceive } = this.tenancy.models(tenantId);

    // Parses filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      PaymentReceive,
      filter
    );
    const { results, pagination } = await PaymentReceive.query()
      .onBuild((builder) => {
        builder.withGraphFetched('customer');
        builder.withGraphFetched('depositAccount');
        dynamicList.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformer the payment receives models to POJO.
    const transformedPayments = await this.transformer.transform(
      tenantId,
      results,
      new PaymentReceiveTransfromer()
    );
    return {
      paymentReceives: transformedPayments,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }

  /**
   * Parses payments receive list filter DTO.
   * @param filterDTO
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
