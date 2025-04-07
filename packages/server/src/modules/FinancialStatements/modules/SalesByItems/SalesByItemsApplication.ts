import { Injectable } from '@nestjs/common';
import {
  ISalesByItemsReportQuery,
  ISalesByItemsSheet,
  ISalesByItemsTable,
} from './SalesByItems.types';
import { SalesByItemsReportService } from './SalesByItemsService';
import { SalesByItemsTableInjectable } from './SalesByItemsTableInjectable';
import { SalesByItemsExport } from './SalesByItemsExport';
import { SalesByItemsPdfInjectable } from './SalesByItemsPdfInjectable';

@Injectable()
export class SalesByItemsApplication {
  constructor(
    private readonly salesByItemsSheet: SalesByItemsReportService,
    private readonly salesByItemsTable: SalesByItemsTableInjectable,
    private readonly salesByItemsExport: SalesByItemsExport,
    private readonly salesByItemsPdf: SalesByItemsPdfInjectable,
  ) {}

  /**
   * Retrieves the sales by items report in json format.
   * @param {ISalesByItemsReportQuery} filter - Sales by items report query.
   * @returns {Promise<ISalesByItemsSheetData>}
   */
  public sheet(
    filter: ISalesByItemsReportQuery,
  ): Promise<ISalesByItemsSheet> {
    return this.salesByItemsSheet.salesByItems(filter);
  }

  /**
   * Retrieves the sales by items report in table format.
   * @param {ISalesByItemsReportQuery} filter - Sales by items report query.
   * @returns {Promise<ISalesByItemsTable>}
   */
  public table(
    filter: ISalesByItemsReportQuery,
  ): Promise<ISalesByItemsTable> {
    return this.salesByItemsTable.table(filter);
  }

  /**
   * Retrieves the sales by items report in csv format.
   * @param {ISalesByItemsReportQuery} filter - Sales by items report query.
   * @returns {Promise<string>}
   */
  public csv(
    filter: ISalesByItemsReportQuery,
  ): Promise<string> {
    return this.salesByItemsExport.csv(filter);
  }

  /**
   * Retrieves the sales by items report in xlsx format.
   * @param {ISalesByItemsReportQuery} filter - Sales by items report query.
   * @returns {Promise<Buffer>}
   */
  public xlsx(
    filter: ISalesByItemsReportQuery,
  ): Promise<Buffer> {
    return this.salesByItemsExport.xlsx(filter);
  }

  /**
   * Retrieves the sales by items in pdf format.
   * @param {ISalesByItemsReportQuery} filter - Sales by items report query.
   * @returns {Promise<Buffer>}
   */
  public pdf(
    query: ISalesByItemsReportQuery,
  ): Promise<Buffer> {
    return this.salesByItemsPdf.pdf(query);
  }
}
