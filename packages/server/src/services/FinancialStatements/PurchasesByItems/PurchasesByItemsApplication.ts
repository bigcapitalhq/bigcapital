import { Service, Inject } from 'typedi';
import { PurchasesByItemsExport } from './PurchasesByItemsExport';
import { IPurchasesByItemsReportQuery } from '@/interfaces/PurchasesByItemsSheet';

@Service()
export class PurcahsesByItemsApplication {
  @Inject()
  private purchasesByItemsSheet: any;

  @Inject()
  private purchasesByItemsTable: any;

  @Inject()
  private purchasesByItemsExport: PurchasesByItemsExport;

  public sheet(tenantId: number, query: any) {}

  public table(tenantId: number, query: any) {}

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
}
