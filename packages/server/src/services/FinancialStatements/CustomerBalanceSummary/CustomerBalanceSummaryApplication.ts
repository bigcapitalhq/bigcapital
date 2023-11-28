import { Inject, Service } from 'typedi';
import { CustomerBalanceSummaryExportInjectable } from './CustomerBalanceSummaryExportInjectable';
import { CustomerBalanceSummaryTableInjectable } from './CustomerBalanceSummaryTableInjectable';
import { ICustomerBalanceSummaryQuery } from '@/interfaces';
import { CustomerBalanceSummaryService } from './CustomerBalanceSummaryService';

@Service()
export class CustomerBalanceSummaryApplication {
  @Inject()
  private customerBalanceSummaryTable: CustomerBalanceSummaryTableInjectable;

  @Inject()
  private customerBalanceSummaryExport: CustomerBalanceSummaryExportInjectable;

  @Inject()
  private customerBalanceSummarySheet: CustomerBalanceSummaryService;

  /**
   * Retrieves the customer balance sheet in json format.
   * @param {number} tenantId
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<ICustomerBalanceSummarySheet>}
   */
  public sheet(tenantId: number, query: ICustomerBalanceSummaryQuery) {
    return this.customerBalanceSummarySheet.customerBalanceSummary(
      tenantId,
      query
    );
  }

  /**
   * Retrieves the customer balance sheet in json format.
   * @param {number} tenantId
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<ICustomerBalanceSummaryTable>}
   */
  public table(tenantId: number, query: ICustomerBalanceSummaryQuery) {
    return this.customerBalanceSummaryTable.table(tenantId, query);
  }

  /**
   * Retrieves the customer balance sheet in XLSX format.
   * @param {number} tenantId
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(tenantId: number, query: ICustomerBalanceSummaryQuery) {
    return this.customerBalanceSummaryExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the customer balance sheet in CSV format.
   * @param {number} tenantId
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public csv(tenantId: number, query: ICustomerBalanceSummaryQuery) {
    return this.customerBalanceSummaryExport.csv(tenantId, query);
  }
}
