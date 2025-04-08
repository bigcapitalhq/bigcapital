import { Exportable } from '@/modules/Export/Exportable';
import { Injectable } from '@nestjs/common';
import { SaleReceiptApplication } from '../SaleReceiptApplication.service';
import { ISalesReceiptsFilter } from '../types/SaleReceipts.types';
import { EXPORT_SIZE_LIMIT } from '@/modules/Export/constants';

@Injectable()
export class SaleReceiptsExportable extends Exportable {
  constructor(private readonly saleReceiptsApp: SaleReceiptApplication) {
    super();
  }

  /**
   * Retrieves the accounts data to exportable sheet.
   * @param {ISalesReceiptsFilter} query -
   */
  public exportable(query: ISalesReceiptsFilter) {
    const filterQuery = (query) => {
      query.withGraphFetched('branch');
      query.withGraphFetched('warehouse');
    };
    const parsedQuery = {
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      ...query,
      page: 1,
      pageSize: EXPORT_SIZE_LIMIT,
      filterQuery,
    } as ISalesReceiptsFilter;

    return this.saleReceiptsApp
      .getSaleReceipts(parsedQuery)
      .then((output) => output.data);
  }
}
