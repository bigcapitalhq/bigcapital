import {
  IInventoryValuationReportQuery,
  IInventoryValuationSheet,
  IInventoryValuationTable,
} from '@/interfaces';
import { Inject, Service } from 'typedi';
import { InventoryValuationSheetService } from './InventoryValuationSheetService';
import { InventoryValuationSheetTableInjectable } from './InventoryValuationSheetTableInjectable';
import { InventoryValuationSheetExportable } from './InventoryValuationSheetExportable';
import { InventoryValuationSheetPdf } from './InventoryValuationSheetPdf';

@Service()
export class InventoryValuationSheetApplication {
  @Inject()
  private inventoryValuationSheet: InventoryValuationSheetService;

  @Inject()
  private inventoryValuationTable: InventoryValuationSheetTableInjectable;

  @Inject()
  private inventoryValuationExport: InventoryValuationSheetExportable;

  @Inject()
  private inventoryValuationPdf: InventoryValuationSheetPdf;

  /**
   * Retrieves the inventory valuation json format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns
   */
  public sheet(
    tenantId: number,
    query: IInventoryValuationReportQuery
  ): Promise<IInventoryValuationSheet> {
    return this.inventoryValuationSheet.inventoryValuationSheet(
      tenantId,
      query
    );
  }

  /**
   * Retrieves the inventory valuation json table format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns {Promise<IInventoryValuationTable>}
   */
  public table(
    tenantId: number,
    query: IInventoryValuationReportQuery
  ): Promise<IInventoryValuationTable> {
    return this.inventoryValuationTable.table(tenantId, query);
  }

  /**
   * Retrieves the inventory valuation xlsx format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns
   */
  public xlsx(
    tenantId: number,
    query: IInventoryValuationReportQuery
  ): Promise<Buffer> {
    return this.inventoryValuationExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the inventory valuation csv format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns
   */
  public csv(
    tenantId: number,
    query: IInventoryValuationReportQuery
  ): Promise<string> {
    return this.inventoryValuationExport.csv(tenantId, query);
  }

  /**
   * Retrieves the inventory valuation pdf format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(
    tenantId: number,
    query: IInventoryValuationReportQuery
  ): Promise<Buffer> {
    return this.inventoryValuationPdf.pdf(tenantId, query);
  }
}
