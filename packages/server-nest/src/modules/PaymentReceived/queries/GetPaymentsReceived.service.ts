import * as R from 'ramda';
import { PaymentReceiveTransfromer } from './PaymentReceivedTransformer';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { PaymentReceived } from '../models/PaymentReceived';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';

@Injectable()
export class GetPaymentsReceivedService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(PaymentReceived.name)
    private readonly paymentReceivedModel: typeof PaymentReceived,
  ) {}

  /**
   * Retrieve payment receives paginated and filterable list.
   * @param {IPaymentsReceivedFilter} paymentReceivesFilter
   */
  public async getPaymentReceives(filterDTO: IPaymentsReceivedFilter): Promise<{
    paymentReceives: PaymentReceived[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    // Parses filter DTO.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      PaymentReceive,
      filter,
    );
    const { results, pagination } = await this.paymentReceivedModel
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('customer');
        builder.withGraphFetched('depositAccount');

        dynamicList.buildQuery()(builder);
        filterDTO?.filterQuery && filterDTO.filterQuery(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformer the payment receives models to POJO.
    const transformedPayments = await this.transformer.transform(
      results,
      new PaymentReceiveTransfromer(),
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
