import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { VendorCreditTransformer } from './VendorCreditTransformer';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { VendorCredit } from '../models/VendorCredit';
import { GetVendorCreditsQueryDto } from '../dtos/GetVendorCreditsQuery.dto';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetVendorCreditsService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: TenantModelProxy<typeof VendorCredit>,
  ) {}

  /**
   * Parses the sale invoice list filter DTO.
   * @param {GetVendorCreditsQueryDto} filterDTO
   * @returns
   */
  private parseListFilterDTO = (filterDTO: GetVendorCreditsQueryDto) => {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  };

  /**
   * Retrieve the vendor credits list.
   * @param {GetVendorCreditsQueryDto} vendorCreditQuery -
   */
  public getVendorCredits = async (
    vendorCreditQuery: GetVendorCreditsQueryDto,
  ) => {
    const filterDto = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...vendorCreditQuery,
    };
    // Parses stringified filter roles.
    const filter = this.parseListFilterDTO(filterDto);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      VendorCredit,
      filter,
    );
    const { results, pagination } = await this.vendorCreditModel()
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries');
        builder.withGraphFetched('vendor');
        dynamicFilter.buildQuery()(builder);

        // Gives ability to inject custom query to filter results.
        filterDto?.filterQuery?.(builder);
      })
      .pagination(filterDto.page - 1, filterDto.pageSize);

    // Transformes the vendor credits models to POJO.
    const data = await this.transformer.transform(
      results,
      new VendorCreditTransformer(),
    );
    return {
      data,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  };
}
