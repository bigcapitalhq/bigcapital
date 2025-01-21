import {
  IInventoryDetailsQuery,
  IInvetoryItemDetailsTable,
} from './InventoryItemDetails.types';
import { InventoryItemDetailsExportInjectable } from './InventoryItemDetailsExportInjectable';
import { InventoryDetailsTableInjectable } from './InventoryItemDetailsTableInjectable';
import { InventoryDetailsService } from './InventoryItemDetails.service';
import { InventoryDetailsTablePdf } from './InventoryItemDetailsTablePdf';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryItemDetailsApplication {
  constructor(
    private readonly inventoryDetailsExport: InventoryItemDetailsExportInjectable,
    private readonly inventoryDetailsTable: InventoryDetailsTableInjectable,
    private readonly inventoryDetails: InventoryDetailsService,
    private readonly inventoryDetailsPdf: InventoryDetailsTablePdf,
  ) {}

  /**
   * Retrieves the inventory details report in sheet format.
   * @param {number} tenantId
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<IInvetoryItemDetailDOO>}
   */
  public sheet(query: IInventoryDetailsQuery) {
    return this.inventoryDetails.inventoryDetails(query);
  }

  /**
   * Retrieve the inventory details report in table format.
   * @param {IInventoryDetailsQuery} query - Inventory details query.
   * @returns
   */
  public table(
    query: IInventoryDetailsQuery,
  ): Promise<IInvetoryItemDetailsTable> {
    return this.inventoryDetailsTable.table(query);
  }

  /**
   * Retrieves the inventory details report in XLSX format.
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: IInventoryDetailsQuery): Promise<Buffer> {
    return this.inventoryDetailsExport.xlsx(query);
  }

  /**
   * Retrieves the inventory details report in CSV format.
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<string>}
   */
  public csv(query: IInventoryDetailsQuery): Promise<string> {
    return this.inventoryDetailsExport.csv(query);
  }

  /**
   * Retrieves the inventory details report in PDF format.
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IInventoryDetailsQuery) {
    return this.inventoryDetailsPdf.pdf(query);
  }
}
