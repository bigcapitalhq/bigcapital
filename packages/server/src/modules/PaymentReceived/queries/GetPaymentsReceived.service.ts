import * as R from 'ramda';
import { PaymentReceiveTransfromer } from './PaymentReceivedTransformer';
import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { PaymentReceived } from '../models/PaymentReceived';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { GetPaymentsReceivedQueryDto } from '../dtos/GetPaymentsReceivedQuery.dto';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetPaymentsReceivedService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(PaymentReceived.name)
    private readonly paymentReceivedModel: TenantModelProxy<
      typeof PaymentReceived
    >,
  ) {}

  /**
   * Retrieve payment receives paginated and filterable list.
   * @param {GetPaymentsReceivedQueryDto} filterDTO
   */
  public async getPaymentReceives(
    filterDTO: GetPaymentsReceivedQueryDto,
  ): Promise<{
    data: PaymentReceived[];
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
    const dynamicList = await this.dynamicListService.dynamicList(
      PaymentReceived,
      filter,
    );
    const { results, pagination } = await this.paymentReceivedModel()
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('customer');
        builder.withGraphFetched('depositAccount');

        dynamicList.buildQuery()(builder);
        if (_filterDto?.filterQuery) {
          _filterDto.filterQuery(builder as any);
        }
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformer the payment receives models to POJO.
    const data = await this.transformer.transform(
      results,
      new PaymentReceiveTransfromer(),
    );
    return {
      data,
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
