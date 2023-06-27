import * as R from 'ramda';
import { Service, Inject } from 'typedi';
import BaseVendorCredit from './BaseVendorCredit';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { IVendorCreditsQueryDTO } from '@/interfaces';
import { VendorCreditTransformer } from './VendorCreditTransformer';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';

@Service()
export default class ListVendorCredits extends BaseVendorCredit {
  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

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
   * @param {number} tenantId - Tenant id.
   * @param {IVendorCreditsQueryDTO} vendorCreditQuery -
   */
  public getVendorCredits = async (
    tenantId: number,
    vendorCreditQuery: IVendorCreditsQueryDTO
  ) => {
    const { VendorCredit } = this.tenancy.models(tenantId);

    // Parses stringified filter roles.
    const filter = this.parseListFilterDTO(vendorCreditQuery);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      VendorCredit,
      filter
    );
    const { results, pagination } = await VendorCredit.query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries');
        builder.withGraphFetched('vendor');
        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Transforms the vendor credits models to POJO.
    const vendorCredits = await this.transformer.transform(
      tenantId,
      results,
      new VendorCreditTransformer()
    );
    return {
      vendorCredits,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  };
}
