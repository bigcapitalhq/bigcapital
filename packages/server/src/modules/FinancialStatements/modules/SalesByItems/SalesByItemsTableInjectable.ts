import { ISalesByItemsReportQuery } from './SalesByItems.types';
import { SalesByItemsReportService } from './SalesByItemsService';
import { SalesByItemsTable } from './SalesByItemsTable';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SalesByItemsTableInjectable {
  constructor(
    private readonly salesByItemSheet: SalesByItemsReportService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the sales by items report in table format.
   * @param {ISalesByItemsReportQuery} filter - The filter to apply to the report.
   * @returns {Promise<ISalesByItemsTable>}
   */
  public async table(filter: ISalesByItemsReportQuery) {
    const { data, query, meta } =
      await this.salesByItemSheet.salesByItems(filter);
    const table = new SalesByItemsTable(data, this.i18n);

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
