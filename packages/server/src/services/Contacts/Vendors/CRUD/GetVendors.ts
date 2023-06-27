import * as R from 'ramda';
import { Service, Inject } from 'typedi';
import {
  IFilterMeta,
  IPaginationMeta,
  IVendor,
  IVendorsFilter,
} from '@/interfaces';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import VendorTransformer from '../VendorTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export class GetVendors {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve vendors datatable list.
   * @param {number} tenantId - Tenant id.
   * @param {IVendorsFilter} vendorsFilter - Vendors filter.
   */
  public async getVendorsList(
    tenantId: number,
    filterDTO: IVendorsFilter
  ): Promise<{
    vendors: IVendor[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { Vendor } = this.tenancy.models(tenantId);

    // Parses vendors list filter DTO.
    const filter = this.parseVendorsListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      tenantId,
      Vendor,
      filter
    );
    // Vendors list.
    const { results, pagination } = await Vendor.query()
      .onBuild((builder) => {
        dynamicList.buildQuery()(builder);

        // Switches between active/inactive modes.
        builder.modify('inactiveMode', filter.inactiveMode);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transform the vendors.
    const transformedVendors = await this.transformer.transform(
      tenantId,
      results,
      new VendorTransformer()
    );
    return {
      vendors: transformedVendors,
      pagination,
      filterMeta: dynamicList.getResponseMeta(),
    };
  }

  /**
   *
   * @param filterDTO
   * @returns
   */
  private parseVendorsListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
