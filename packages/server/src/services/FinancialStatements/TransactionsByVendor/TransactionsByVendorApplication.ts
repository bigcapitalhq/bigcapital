import { Inject, Service } from 'typedi';
import { ITransactionsByVendorsFilter } from '@/interfaces';
import { TransactionsByVendorExportInjectable } from './TransactionsByVendorExportInjectable';
import { TransactionsByVendorTableInjectable } from './TransactionsByVendorTableInjectable';
import { TransactionsByVendorsInjectable } from './TransactionsByVendorInjectable';

@Service()
export class TransactionsByVendorApplication {
  @Inject()
  private transactionsByVendorTable: TransactionsByVendorTableInjectable;

  @Inject()
  private transactionsByVendorExport: TransactionsByVendorExportInjectable;

  @Inject()
  private transactionsByVendorSheet: TransactionsByVendorsInjectable;

  /**
   * Retrieves the transactions by vendor in sheet format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   */
  public sheet(tenantId: number, query: ITransactionsByVendorsFilter) {
    return this.transactionsByVendorSheet.transactionsByVendors(
      tenantId,
      query
    );
  }

  /**
   * Retrieves the transactions by vendor in table format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   */
  public table(tenantId: number, query: ITransactionsByVendorsFilter) {
    return this.transactionsByVendorTable.table(tenantId, query);
  }

  /**
   * Retrieves the transactions by vendor in CSV format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   */
  public csv(tenantId: number, query: ITransactionsByVendorsFilter) {
    return this.transactionsByVendorExport.csv(tenantId, query);
  }

  /**
   * Retrieves the transactions by vendor in XLSX format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   */
  public xlsx(tenantId: number, query: ITransactionsByVendorsFilter) {
    return this.transactionsByVendorExport.xlsx(tenantId, query);
  }
}
