import { ICustomer, ICustomersFilter, IFilterMeta, IPaginationMeta } from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import * as R from 'ramda';
import { Inject, Service } from 'typedi';
import CustomerTransfromer from '../CustomerTransformer';

@Service()
export class GetCustomers {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Parses customers list filter DTO.
   * @param filterDTO -
   */
  private parseCustomersListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }

  /**
   * Retrieve customers paginated list.
   * @param {number} tenantId - Tenant id.
   * @param {ICustomersFilter} filter - Cusotmers filter.
   */
  public async getCustomersList(
    tenantId: number,
    filterDTO: ICustomersFilter,
  ): Promise<{
    customers: ICustomer[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { Customer } = this.tenancy.models(tenantId);

    // Parses customers list filter DTO.
    const filter = this.parseCustomersListFilterDTO(filterDTO);

    // Dynamic list.
    const dynamicList = await this.dynamicListService.dynamicList(tenantId, Customer, filter);
    // Customers.
    const { results, pagination } = await Customer.query()
      .onBuild((builder) => {
        dynamicList.buildQuery()(builder);
        builder.modify('inactiveMode', filter.inactiveMode);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed customers.
    const customers = await this.transformer.transform(tenantId, results, new CustomerTransfromer());
    return {
      customers,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }
}
