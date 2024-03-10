import { Inject, Service } from 'typedi';
import { ISalesByItemsReportQuery } from '@/interfaces';
import { SalesByItemsReportService } from './SalesByItemsService';
import { SalesByItemsTable } from './SalesByItemsTable';

@Service()
export class SalesByItemsTableInjectable {
  @Inject()
  private salesByItemSheet: SalesByItemsReportService;

  /**
   * Retrieves the sales by items report in table format.
   * @param {number} tenantId
   * @param {ISalesByItemsReportQuery} filter
   * @returns {Promise<ISalesByItemsTable>}
   */
  public async table(tenantId: number, filter: ISalesByItemsReportQuery) {
    const { data, query, meta } = await this.salesByItemSheet.salesByItems(
      tenantId,
      filter
    );
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
