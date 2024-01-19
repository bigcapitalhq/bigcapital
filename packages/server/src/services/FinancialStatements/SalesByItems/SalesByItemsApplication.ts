import { Inject, Service } from 'typedi';
import {
  ISalesByItemsReportQuery,
  ISalesByItemsSheet,
  ISalesByItemsSheetData,
  ISalesByItemsTable,
} from '@/interfaces';
import { SalesByItemsReportService } from './SalesByItemsService';
import { SalesByItemsTableInjectable } from './SalesByItemsTableInjectable';
import { SalesByItemsExport } from './SalesByItemsExport';

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
   * @returns {Promise<ISalesByItemsSheetData>}
   */
  public sheet(
    tenantId: number,
    filter: ISalesByItemsReportQuery
  ): Promise<ISalesByItemsSheet> {
    return this.salesByItemsSheet.salesByItems(tenantId, filter);
  }

  /**
   * Retrieves the sales by items report in table format.
   * @param {number} tenantId
   * @param {ISalesByItemsReportQuery} filter
   * @returns {Promise<ISalesByItemsTable>}
   */
  public table(
    tenantId: number,
    filter: ISalesByItemsReportQuery
  ): Promise<ISalesByItemsTable> {
    return this.salesByItemsTable.table(tenantId, filter);
  }

  /**
   * Retrieves the sales by items report in csv format.
   * @param {number} tenantId
   * @param {ISalesByItemsReportQuery} filter
   * @returns {Promise<string>}
   */
  public csv(
    tenantId: number,
    filter: ISalesByItemsReportQuery
  ): Promise<string> {
    return this.salesByItemsExport.csv(tenantId, filter);
  }

  /**
   * Retrieves the sales by items report in xlsx format.
   * @param {number} tenantId
   * @param {ISalesByItemsReportQuery} filter
   * @returns {Promise<Buffer>}
   */
  public xlsx(
    tenantId: number,
    filter: ISalesByItemsReportQuery
  ): Promise<Buffer> {
    return this.salesByItemsExport.xlsx(tenantId, filter);
  }
}
