import * as R from 'ramda';
import { Vendor } from '../models/Vendor';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Inject, Injectable } from '@nestjs/common';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { VendorTransfromer } from './VendorTransformer';

@Injectable()
export class GetVendorsService {
  constructor(
    private dynamicListService: DynamicListService,
    private transformer: TransformerInjectable,

    @Inject(Vendor.name) private vendorModel: typeof Vendor,
  ) {}

  /**
   * Retrieve vendors datatable list.
   * @param {IVendorsFilter} vendorsFilter - Vendors filter.
   */
  public async getVendorsList(filterDTO: IVendorsFilter): Promise<{
    vendors: Vendor[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    // Parses vendors list filter DTO.
    const filter = this.parseVendorsListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicList = await this.dynamicListService.dynamicList(
      this.vendorModel,
      filter,
    );
    // Vendors list.
    const { results, pagination } = await this.vendorModel
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
