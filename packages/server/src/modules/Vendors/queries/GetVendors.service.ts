import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { Vendor } from '../models/Vendor';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { VendorTransfromer } from './VendorTransformer';
import { GetVendorsResponse, IVendorsFilter } from '../types/Vendors.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetVendorsService {
  /**
   * Constructor method.
   * @param {DynamicListService} dynamicListService
   * @param {TransformerInjectable} transformer
   * @param {typeof Vendor} vendorModel
   */
  constructor(
    private dynamicListService: DynamicListService,
    private transformer: TransformerInjectable,

    @Inject(Vendor.name) private vendorModel: TenantModelProxy<typeof Vendor>,
  ) {}

  /**
   * Retrieve vendors datatable list.
   * @param {IVendorsFilter} vendorsFilter - Vendors filter.
   * @returns {Promise<GetVendorsResponse>}
   */
  public async getVendorsList(
    filterDto: Partial<IVendorsFilter>,
  ): Promise<GetVendorsResponse> {
    const _filterDto = {
      inactiveMode: false,
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...filterDto,
    };
    // Parses vendors list filter DTO.
    const filter = this.parseVendorsListFilterDTO(_filterDto);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      this.vendorModel(),
      filter,
    );
    // Vendors list.
    const { results, pagination } = await this.vendorModel()
      .query()
      .onBuild((builder) => {
        dynamicList.buildQuery()(builder);

        // Switches between active/inactive modes.
        builder.modify('inactiveMode', filter.inactiveMode);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transform the vendors.
    const transformedVendors = await this.transformer.transform(
      results,
      new VendorTransfromer(),
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
