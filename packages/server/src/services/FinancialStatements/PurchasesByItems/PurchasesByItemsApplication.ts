import { Service, Inject } from 'typedi';
import { PurchasesByItemsExport } from './PurchasesByItemsExport';
import {
  IPurchasesByItemsReportQuery,
  IPurchasesByItemsSheet,
  IPurchasesByItemsTable,
} from '@/interfaces/PurchasesByItemsSheet';
import { PurchasesByItemsTableInjectable } from './PurchasesByItemsTableInjectable';
import { PurchasesByItemsService } from './PurchasesByItemsService';
import { PurchasesByItemsPdf } from './PurchasesByItemsPdf';

@Service()
export class PurcahsesByItemsApplication {
  @Inject()
  private purchasesByItemsSheet: PurchasesByItemsService;

  @Inject()
  private purchasesByItemsTable: PurchasesByItemsTableInjectable;

  @Inject()
  private purchasesByItemsExport: PurchasesByItemsExport;

  @Inject()
  private purchasesByItemsPdf: PurchasesByItemsPdf;

  /**
   * Retrieves the purchases by items in json format.
   * @param {number} tenantId
   * @param {IPurchasesByItemsReportQuery} query
   * @returns
   */
  public sheet(
    tenantId: number,
    query: IPurchasesByItemsReportQuery
  ): Promise<IPurchasesByItemsSheet> {
    return this.purchasesByItemsSheet.purchasesByItems(tenantId, query);
  }

  /**
   * Retrieves the purchases by items in table format.
   * @param {number} tenantId
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {Promise<IPurchasesByItemsTable>}
   */
  public table(
    tenantId: number,
    query: IPurchasesByItemsReportQuery
  ): Promise<IPurchasesByItemsTable> {
    return this.purchasesByItemsTable.table(tenantId, query);
  }

  /**
   * Retrieves the purchases by items in csv format.
   * @param {number} tenantId
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {Promise<string>}
   */
  public csv(
    tenantId: number,
    query: IPurchasesByItemsReportQuery
  ): Promise<string> {
    return this.purchasesByItemsExport.csv(tenantId, query);
  }

  /**
   * Retrieves the purchases by items in xlsx format.
   * @param {number} tenantId
   * @param {IPurchasesByItemsReportQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(
    tenantId: number,
    query: IPurchasesByItemsReportQuery
  ): Promise<Buffer> {
    return this.purchasesByItemsExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the purchases by items in pdf format.
   * @param {number} tenantId
   * @param {IPurchasesByItemsReportQuery} filter
   * @returns {Promise<Buffer>}
   */
  public pdf(
    tenantId: number,
    filter: IPurchasesByItemsReportQuery
  ): Promise<Buffer> {
    return this.purchasesByItemsPdf.pdf(tenantId, filter);
  }
}
