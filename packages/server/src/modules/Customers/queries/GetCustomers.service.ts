import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Inject, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { Customer } from '../models/Customer';
import { CustomerTransfromer } from './CustomerTransformer';
import { GetCustomersResponse } from '../types/Customers.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { GetCustomersQueryDto } from '../dtos/GetCustomersQuery.dto';
import { CustomFieldValuesService } from '@/modules/CustomFields/CustomFieldValues.service';

@Injectable()
export class GetCustomers {
  constructor(
    private dynamicListService: DynamicListService,
    private transformer: TransformerInjectable,
    private customFieldValuesService: CustomFieldValuesService,

    @Inject(Customer.name)
    private customerModel: TenantModelProxy<typeof Customer>,
  ) {}

  /**
   * Parses customers list filter DTO.
   * @param filterDTO -
   */
  private parseCustomersListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieves customers paginated list.
   * @param {GetCustomersQueryDto} filter - Cusotmers filter.
   * @returns {Promise<GetCustomersResponse>}
   */
  public async getCustomersList(
    filterDto: GetCustomersQueryDto,
  ): Promise<GetCustomersResponse> {
    const _filterDto = {
      inactiveMode: false,
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...filterDto,
    };
    // Parses customers list filter DTO.
    const filter = this.parseCustomersListFilterDTO(_filterDto);

    const dynamicList = await this.dynamicListService.dynamicList(
      this.customerModel(),
      filter,
    );
    const { results, pagination } = await this.customerModel()
      .query()
      .onBuild((builder) => {
        dynamicList.buildQuery()(builder);
        builder.modify('inactiveMode', filter.inactiveMode);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed customers.
    const data = await this.transformer.transform(
      results,
      new CustomerTransfromer(),
    );

    // Attach the custom field values.
    const customFieldsMap = await this.customFieldValuesService.getValuesBulk(
      'Customer',
      data.map((customer) => customer.id),
    );
    data.forEach((customer) => {
      customer.customFields = customFieldsMap[customer.id] ?? {};
    });

    return {
      data,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }
}
