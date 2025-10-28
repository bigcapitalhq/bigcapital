import { ISalesByItemsReportQuery } from './SalesByItems.types';
import { SalesByItemsReportService } from './SalesByItemsService';
import { SalesByItemsTable } from './SalesByItemsTable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SalesByItemsTableInjectable {
  constructor(private readonly salesByItemSheet: SalesByItemsReportService) {}

  /**
   * Retrieves the sales by items report in table format.
   * @param {ISalesByItemsReportQuery} filter - The filter to apply to the report.
   * @returns {Promise<ISalesByItemsTable>}
   */
  public async table(filter: ISalesByItemsReportQuery) {
    const { data, query, meta } =
      await this.salesByItemSheet.salesByItems(filter);
    const table = new SalesByItemsTable(data);

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableData(),
      },
      meta,
      query,
    };
  }
}
