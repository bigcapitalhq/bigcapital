import * as R from 'ramda';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BillPayment } from '../models/BillPayment';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { BillPaymentTransformer } from './BillPaymentTransformer';
import { GetBillPaymentsFilterDto } from '../dtos/GetBillPaymentsFilter.dto';

@Injectable()
export class GetBillPaymentsService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(BillPayment.name)
    private readonly billPaymentModel: TenantModelProxy<typeof BillPayment>,
  ) {}

  /**
   * Retrieve bill payment paginted and filterable list.
   * @param {GetBillPaymentsFilterDto} billPaymentsFilter
   */
  public async getBillPayments(filterDTO: GetBillPaymentsFilterDto) {
    const _filterDto = {
      page: 1,
      pageSize: 12,
      filterRoles: [],
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...filterDTO,
    };
    // Parses filter DTO.
    const filter = this.parseListFilterDTO(_filterDto);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      BillPayment,
      filter,
    );
    const { results, pagination } = await this.billPaymentModel()
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('vendor');
        builder.withGraphFetched('paymentAccount');

        dynamicList.buildQuery()(builder);
        filter?.filterQuery && filter?.filterQuery(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformes the bill payments models to POJO.
    const billPayments = await this.transformer.transform(
      results,
      new BillPaymentTransformer(),
    );
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
