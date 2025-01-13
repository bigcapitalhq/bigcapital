import * as R from 'ramda';
import { Inject, Injectable } from '@nestjs/common';
import { VendorCreditTransformer } from './VendorCreditTransformer';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { VendorCredit } from '../models/VendorCredit';
import { IVendorCreditsQueryDTO } from '../types/VendorCredit.types';

@Injectable()
export class GetVendorCreditsService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(VendorCredit.name)
    private readonly vendorCreditModel: typeof VendorCredit,
  ) {}

  /**
   * Parses the sale invoice list filter DTO.
   * @param {IVendorCreditsQueryDTO} filterDTO
   * @returns
   */
  private parseListFilterDTO = (filterDTO: IVendorCreditsQueryDTO) => {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  };

  /**
   * Retrieve the vendor credits list.
   * @param {IVendorCreditsQueryDTO} vendorCreditQuery -
   */
  public getVendorCredits = async (
    vendorCreditQuery: IVendorCreditsQueryDTO,
  ) => {
    // Parses stringified filter roles.
    const filter = this.parseListFilterDTO(vendorCreditQuery);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      VendorCredit,
      filter,
    );
    const { results, pagination } = await this.vendorCreditModel
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries');
        builder.withGraphFetched('vendor');
        dynamicFilter.buildQuery()(builder);

        // Gives ability to inject custom query to filter results.
        vendorCreditQuery?.filterQuery &&
          vendorCreditQuery?.filterQuery(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transformes the vendor credits models to POJO.
    const vendorCredits = await this.transformer.transform(
      results,
      new VendorCreditTransformer(),
    );
    return {
      vendorCredits,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  };
}
