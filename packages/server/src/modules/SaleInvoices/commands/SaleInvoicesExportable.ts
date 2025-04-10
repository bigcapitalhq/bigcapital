import { Exportable } from '@/modules/Export/Exportable';
import { Injectable } from '@nestjs/common';
import { SaleInvoiceApplication } from '../SaleInvoices.application';
import { ISalesInvoicesFilter } from '../SaleInvoice.types';
import { EXPORT_SIZE_LIMIT } from '@/modules/Export/constants';
import { ExportableService } from '@/modules/Export/decorators/ExportableModel.decorator';
import { SaleInvoice } from '../models/SaleInvoice';

@Injectable()
@ExportableService({ name: SaleInvoice.name })
export class SaleInvoicesExportable extends Exportable{
  constructor(
    private readonly saleInvoicesApplication: SaleInvoiceApplication,
  ) {
    super();
  }

  /**
   * Retrieves the accounts data to exportable sheet.
   */
  public exportable(query: ISalesInvoicesFilter) {
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
    } as ISalesInvoicesFilter;

    return this.saleInvoicesApplication
      .getSaleInvoices(parsedQuery)
      .then((output) => output.salesInvoices);
  }
}
