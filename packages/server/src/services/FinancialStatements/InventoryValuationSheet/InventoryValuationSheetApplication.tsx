import { IInventoryValuationReportQuery } from '@/interfaces';
import { Inject, Service } from 'typedi';
import { InventoryValuationSheetService } from './InventoryValuationSheetService';
import { InventoryValuationSheetTableInjectable } from './InventoryValuationSheetTableInjectable';
import { InventoryValuationSheetExportable } from './InventoryValuationSheetExportable';

@Service()
export class InventoryValuationSheetApplication {
  @Inject()
  inventoryValuationSheet: InventoryValuationSheetService;

  @Inject()
  inventoryValuationTable: InventoryValuationSheetTableInjectable;

  @Inject()
  inventoryValuationExport: InventoryValuationSheetExportable;

  /**
   * Retrieves the inventory valuation json format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns
   */
  public sheet(tenantId: number, query: IInventoryValuationReportQuery) {
    return this.inventoryValuationSheet.inventoryValuationSheet(
      tenantId,
      query
    );
  }

  /**
   * Retrieves the inventory valuation json table format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns
   */
  public table(tenantId: number, query: IInventoryValuationReportQuery) {
    return this.inventoryValuationTable.table(tenantId, query);
  }

  /**
   * Retrieves the inventory valuation xlsx format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns
   */
  public xlsx(tenantId: number, query: IInventoryValuationReportQuery) {
    return this.inventoryValuationExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the inventory valuation csv format.
   * @param {number} tenantId
   * @param {IInventoryValuationReportQuery} query
   * @returns
   */
  public csv(tenantId: number, query: IInventoryValuationReportQuery) {
    return this.inventoryValuationExport.csv(tenantId, query);
  }
}
