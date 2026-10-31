import { Injectable } from '@nestjs/common';
import { InventoryTurnoverByAmountService } from './InventoryTurnoverByAmount.service';
import { InventoryTurnoverByAmountTableInjectable } from './InventoryTurnoverByAmountTableInjectable';
import { InventoryTurnoverByAmountExportable } from './InventoryTurnoverByAmountExportable';
import { InventoryTurnoverByAmountPdf } from './InventoryTurnoverByAmountPdf';
import {
  IInventoryTurnoverByAmountQuery,
  IInventoryTurnoverByAmountSheet,
  IInventoryTurnoverByAmountTable,
} from './InventoryTurnoverByAmount.types';

@Injectable()
export class InventoryTurnoverByAmountApplication {
  constructor(
    private readonly inventoryTurnoverByAmount: InventoryTurnoverByAmountService,
    private readonly inventoryTurnoverByAmountTable: InventoryTurnoverByAmountTableInjectable,
    private readonly inventoryTurnoverByAmountExport: InventoryTurnoverByAmountExportable,
    private readonly inventoryTurnoverByAmountPdf: InventoryTurnoverByAmountPdf,
  ) {}

  /**
   * Retrieve the inventory turnover report in JSON format.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @returns {Promise<IInventoryTurnoverByAmountSheet>}
   */
  public sheet(
    query: IInventoryTurnoverByAmountQuery,
  ): Promise<IInventoryTurnoverByAmountSheet> {
    return this.inventoryTurnoverByAmount.inventoryTurnoverByAmount(query);
  }

  /**
   * Retrieve the inventory turnover report in table format.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @returns {Promise<IInventoryTurnoverByAmountTable>}
   */
  public table(
    query: IInventoryTurnoverByAmountQuery,
  ): Promise<IInventoryTurnoverByAmountTable> {
    return this.inventoryTurnoverByAmountTable.table(query);
  }

  /**
   * Retrieve the inventory turnover report in XLSX format.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: IInventoryTurnoverByAmountQuery): Promise<Buffer> {
    return this.inventoryTurnoverByAmountExport.xlsx(query);
  }

  /**
   * Retrieve the inventory turnover report in CSV format.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @returns {Promise<string>}
   */
  public csv(query: IInventoryTurnoverByAmountQuery): Promise<string> {
    return this.inventoryTurnoverByAmountExport.csv(query);
  }

  /**
   * Retrieve the inventory turnover report in PDF format.
   * @param {IInventoryTurnoverByAmountQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IInventoryTurnoverByAmountQuery): Promise<Buffer> {
    return this.inventoryTurnoverByAmountPdf.pdf(query);
  }
}
