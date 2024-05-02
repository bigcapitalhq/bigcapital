import { Inject, Service } from 'typedi';
import * as R from 'ramda';
import {
  IFilterMeta,
  IPaginationMeta,
  ISaleInvoice,
  ISalesInvoicesFilter,
} from '@/interfaces';
import { TransformerInjectable } from '@/lib/Transformer/TransformerInjectable';
import HasTenancyService from '@/services/Tenancy/TenancyService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { SaleInvoiceTransformer } from './SaleInvoiceTransformer';

@Service()
export class GetSaleInvoices {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private dynamicListService: DynamicListingService;

  @Inject()
  private transformer: TransformerInjectable;

  /**
   * Retrieve sales invoices filterable and paginated list.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async getSaleInvoices(
    tenantId: number,
    filterDTO: ISalesInvoicesFilter
  ): Promise<{
    salesInvoices: ISaleInvoice[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    const { SaleInvoice } = this.tenancy.models(tenantId);

    // Parses stringified filter roles.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      tenantId,
      SaleInvoice,
      filter
    );
    const { results, pagination } = await SaleInvoice.query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries.item');
        builder.withGraphFetched('customer');
        dynamicFilter.buildQuery()(builder);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed sale invoices.
    const salesInvoices = await this.transformer.transform(
      tenantId,
      results,
      new SaleInvoiceTransformer()
    );

    return {
      salesInvoices,
      pagination,
      filterMeta: dynamicFilter.getResponseMeta(),
    };
  }

  /**
   * Parses the sale invoice list filter DTO.
   * @param filterDTO
   * @returns
   */
  private parseListFilterDTO(filterDTO) {
    return R.compose(this.dynamicListService.parseStringifiedFilter)(filterDTO);
  }
}
