import { Injectable } from '@nestjs/common';
import {
  IInventorySummaryQuery,
  IInventorySummarySheet,
  IInventorySummaryTable,
} from './InventorySummary.types';
import { InventorySummaryService } from './InventorySummaryService';
import { InventorySummaryTableInjectable } from './InventorySummaryTableInjectable';
import { InventorySummaryExportInjectable } from './InventorySummaryExportInjectable';
import { InventorySummaryTablePdf } from './InventorySummaryTablePdf';

@Injectable()
export class InventorySummaryApplication {
  constructor(
    private readonly inventorySummaryService: InventorySummaryService,
    private readonly inventorySummaryTable: InventorySummaryTableInjectable,
    private readonly inventorySummaryExport: InventorySummaryExportInjectable,
    private readonly inventorySummaryPdf: InventorySummaryTablePdf,
  ) {}

  /**
   * Retrieve the inventory summary report in JSON format.
   * @param {IInventorySummaryQuery} query
   * @returns {Promise<IInventorySummarySheet>}
   */
  public sheet(query: IInventorySummaryQuery): Promise<IInventorySummarySheet> {
    return this.inventorySummaryService.inventorySummary(query);
  }

  /**
   * Retrieve the inventory summary report in table format.
   * @param {IInventorySummaryQuery} query
   * @returns {Promise<IInventorySummaryTable>}
   */
  public table(query: IInventorySummaryQuery): Promise<IInventorySummaryTable> {
    return this.inventorySummaryTable.table(query);
  }

  /**
   * Retrieve the inventory summary report in CSV format.
   * @param {IInventorySummaryQuery} query
   * @returns {Promise<string>}
   */
  public csv(query: IInventorySummaryQuery): Promise<string> {
    return this.inventorySummaryExport.csv(query);
  }

  /**
   * Retrieve the inventory summary report in XLSX format.
   * @param {IInventorySummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: IInventorySummaryQuery): Promise<Buffer> {
    return this.inventorySummaryExport.xlsx(query);
  }

  /**
   * Retrieve the inventory summary report in PDF format.
   * @param {IInventorySummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IInventorySummaryQuery): Promise<Buffer> {
    return this.inventorySummaryPdf.pdf(query);
  }
}
