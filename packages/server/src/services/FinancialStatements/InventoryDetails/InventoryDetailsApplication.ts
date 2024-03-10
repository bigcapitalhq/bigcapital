import {
  IInventoryDetailsQuery,
  IInvetoryItemDetailsTable,
} from '@/interfaces';
import { Inject, Service } from 'typedi';
import { InventoryDetailsExportInjectable } from './InventoryDetailsExportInjectable';
import { InventoryDetailsTableInjectable } from './InventoryDetailsTableInjectable';
import { InventoryDetailsService } from './InventoryDetailsService';
import { InventoryDetailsTablePdf } from './InventoryDetailsTablePdf';

@Service()
export class InventortyDetailsApplication {
  @Inject()
  private inventoryDetailsExport: InventoryDetailsExportInjectable;

  @Inject()
  private inventoryDetailsTable: InventoryDetailsTableInjectable;

  @Inject()
  private inventoryDetails: InventoryDetailsService;

  @Inject()
  private inventoryDetailsPdf: InventoryDetailsTablePdf;

  /**
   * Retrieves the inventory details report in sheet format.
   * @param {number} tenantId
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<IInvetoryItemDetailDOO>}
   */
  public sheet(tenantId: number, query: IInventoryDetailsQuery) {
    return this.inventoryDetails.inventoryDetails(tenantId, query);
  }

  /**
   * Retrieve the inventory details report in table format.
   * @param {number} tenantId
   * @param {IInventoryDetailsQuery} query
   * @returns
   */
  public table(
    tenantId: number,
    query: IInventoryDetailsQuery
  ): Promise<IInvetoryItemDetailsTable> {
    return this.inventoryDetailsTable.table(tenantId, query);
  }

  /**
   * Retrieves the inventory details report in XLSX format.
   * @param {number} tenantId
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(
    tenantId: number,
    query: IInventoryDetailsQuery
  ): Promise<Buffer> {
    return this.inventoryDetailsExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the inventory details report in CSV format.
   * @param {number} tenantId
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<string>}
   */
  public csv(tenantId: number, query: IInventoryDetailsQuery): Promise<string> {
    return this.inventoryDetailsExport.csv(tenantId, query);
  }

  /**
   * Retrieves the inventory details report in PDF format.
   * @param {number} tenantId
   * @param {IInventoryDetailsQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(tenantId: number, query: IInventoryDetailsQuery) {
    return this.inventoryDetailsPdf.pdf(tenantId, query);
  }
}
