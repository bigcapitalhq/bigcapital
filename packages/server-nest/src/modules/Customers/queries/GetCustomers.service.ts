import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Inject, Injectable } from '@nestjs/common';
import * as R from 'ramda';
import { Customer } from '../models/Customer';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { CustomerTransfromer } from './CustomerTransformer';

@Injectable()
export class GetCustomers {
  constructor(
    private dynamicListService: DynamicListService,
    private transformer: TransformerInjectable,

    @Inject(Customer.name) private customerModel: typeof Customer,
  ) {}

  /**
   * Parses customers list filter DTO.
   * @param filterDTO -
   */
  private parseCustomersListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve customers paginated list.
   * @param {ICustomersFilter} filter - Cusotmers filter.
   */
  public async getCustomersList(filterDTO: ICustomersFilter): Promise<{
    customers: Customer[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    // Parses customers list filter DTO.
    const filter = this.parseCustomersListFilterDTO(filterDTO);

    const dynamicList = await this.dynamicListService.dynamicList(
      Customer,
      filter,
    );
    const { results, pagination } = await this.customerModel
      .query()
      .onBuild((builder) => {
        dynamicList.buildQuery()(builder);
        builder.modify('inactiveMode', filter.inactiveMode);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed customers.
    const customers = await this.transformer.transform(
      results,
      new CustomerTransfromer(),
    );
    return {
      customers,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }
}
