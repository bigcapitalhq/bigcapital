import * as R from 'ramda';
import { SaleInvoiceTransformer } from './SaleInvoice.transformer';
import { Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { DynamicListService } from '@/modules/DynamicListing/DynamicList.service';
import { IFilterMeta, IPaginationMeta } from '@/interfaces/Model';
import { SaleInvoice } from '../models/SaleInvoice';
import { ISalesInvoicesFilter } from '../SaleInvoice.types';
import { Knex } from 'knex';

@Injectable()
export class GetSaleInvoicesService {
  constructor(
    private readonly dynamicListService: DynamicListService,
    private readonly transformer: TransformerInjectable,
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
    const { results, pagination } = await SaleInvoice.query()
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
