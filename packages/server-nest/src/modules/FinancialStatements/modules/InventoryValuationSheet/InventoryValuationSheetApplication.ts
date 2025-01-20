import {
  IInventoryValuationReportQuery,
  IInventoryValuationSheet,
  IInventoryValuationTable,
} from './InventoryValuationSheet.types';
import { InventoryValuationSheetService } from './InventoryValuationSheetService';
import { InventoryValuationSheetTableInjectable } from './InventoryValuationSheetTableInjectable';
import { InventoryValuationSheetExportable } from './InventoryValuationSheetExportable';
import { InventoryValuationSheetPdf } from './InventoryValuationSheetPdf';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryValuationSheetApplication {
  constructor(
    private readonly inventoryValuationSheet: InventoryValuationSheetService,
    private readonly inventoryValuationTable: InventoryValuationSheetTableInjectable,
    private readonly inventoryValuationExport: InventoryValuationSheetExportable,
    private readonly inventoryValuationPdf: InventoryValuationSheetPdf,
  ) {}

  /**
   * Retrieves the inventory valuation json format.
   * @param {IInventoryValuationReportQuery} query
   * @returns
   */
  public sheet(
    query: IInventoryValuationReportQuery,
  ): Promise<IInventoryValuationSheet> {
    return this.inventoryValuationSheet.inventoryValuationSheet(query);
  }

  /**
   * Retrieves the inventory valuation json table format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns {Promise<IInventoryValuationTable>}
   */
  public table(
    query: IInventoryValuationReportQuery,
  ): Promise<IInventoryValuationTable> {
    return this.inventoryValuationTable.table(query);
  }

  /**
   * Retrieves the inventory valuation xlsx format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns
   */
  public xlsx(query: IInventoryValuationReportQuery): Promise<Buffer> {
    return this.inventoryValuationExport.xlsx(query);
  }

  /**
   * Retrieves the inventory valuation csv format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns
   */
  public csv(query: IInventoryValuationReportQuery): Promise<string> {
    return this.inventoryValuationExport.csv(query);
  }

  /**
   * Retrieves the inventory valuation pdf format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IInventoryValuationReportQuery): Promise<Buffer> {
    return this.inventoryValuationPdf.pdf(query);
  }
}
