import { ISalesByItemsReportQuery } from '@/interfaces';
import { SalesByItemsReportService } from './SalesByItemsService';
import { SalesByItemsTableInjectable } from './SalesByItemsTableInjectable';
import { SalesByItemsExport } from './SalesByItemsExport';
import { Inject, Service } from 'typedi';

@Service()
export class SalesByItemsApplication {
  @Inject()
  private salesByItemsSheet: SalesByItemsReportService;

  @Inject()
  private salesByItemsTable: SalesByItemsTableInjectable;

  @Inject()
  private salesByItemsExport: SalesByItemsExport;

  /**
   * Retrieves the sales by items report in json format.
   * @param {number} tenantId
   * @param {ISalesByItemsReportQuery} filter
   * @returns {Promise<ISalesByItemsTable>}
   */
  public sheet(tenantId: number, filter: ISalesByItemsReportQuery) {
    return this.salesByItemsSheet.salesByItems(tenantId, filter);
  }
  /**
   * Retrieves the sales by items report in table format.
   * @param {number} tenantId
   * @param {ISalesByItemsReportQuery} filter
   * @returns {Promise<ISalesByItemsTable>}
   */
  public table(tenantId: number, filter: ISalesByItemsReportQuery) {
    return this.salesByItemsTable.table(tenantId, filter);
  }
  /**
   * Retrieves the sales by items report in csv format.
   * @param {number} tenantId
   * @param {ISalesByItemsReportQuery} filter
   * @returns {Promise<Buffer>}
   */
  public csv(tenantId: number, filter: ISalesByItemsReportQuery) {
    return this.salesByItemsExport.csv(tenantId, filter);
  }
  /**
   * Retrieves the sales by items report in xlsx format.
   * @param {number} tenantId
   * @param {ISalesByItemsReportQuery} filter
   * @returns {Promise<Buffer>}
   */
  public xlsx(tenantId: number, filter: ISalesByItemsReportQuery) {
    return this.salesByItemsExport.xlsx(tenantId, filter);
  }
}
