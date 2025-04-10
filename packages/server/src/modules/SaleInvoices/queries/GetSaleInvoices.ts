import * as R from 'ramda';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { SaleInvoiceTransformer } from './SaleInvoice.transformer';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { SaleInvoice } from '../models/SaleInvoice';
import { ISalesInvoicesFilter } from '../SaleInvoice.types';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class GetSaleInvoicesService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,

    @Inject(SaleInvoice.name)
    private readonly saleInvoiceModel: TenantModelProxy<typeof SaleInvoice>,
  ) {}

  /**
   * Retrieve sales invoices filterable and paginated list.
   * @param {ISalesInvoicesFilter} filterDTO -
   * @returns {Promise<{ salesInvoices: SaleInvoice[]; pagination: IPaginationMeta; filterMeta: IFilterMeta; }>}
   */
  public async getSaleInvoices(filterDTO: ISalesInvoicesFilter): Promise<{
    salesInvoices: SaleInvoice[];
    pagination: IPaginationMeta;
    filterMeta: IFilterMeta;
  }> {
    // Parses stringified filter roles.
    const filter = this.parseListFilterDTO(filterDTO);

    // Dynamic list service.
    const dynamicFilter = await this.dynamicListService.dynamicList(
      SaleInvoice,
      filter,
    );
    const { results, pagination } = await this.saleInvoiceModel()
      .query()
      .onBuild((builder) => {
        builder.withGraphFetched('entries.item');
        builder.withGraphFetched('customer');

        dynamicFilter.buildQuery()(builder);
        filterDTO?.filterQuery?.(builder as any);
      })
      .pagination(filter.page - 1, filter.pageSize);

    // Retrieves the transformed sale invoices.
    const salesInvoices = await this.transformer.transform(
      results,
      new SaleInvoiceTransformer(),
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
