import { Inject, Service } from 'typedi';
import {
  ITransactionsByVendorTable,
  ITransactionsByVendorsFilter,
  ITransactionsByVendorsStatement,
} from '@/interfaces';
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
   * @returns {Promise<ITransactionsByVendorsStatement>}
   */
  public sheet(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<ITransactionsByVendorsStatement> {
    return this.transactionsByVendorSheet.transactionsByVendors(
      tenantId,
      query
    );
  }

  /**
   * Retrieves the transactions by vendor in table format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   * @returns {Promise<ITransactionsByVendorTable>}
   */
  public table(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<ITransactionsByVendorTable> {
    return this.transactionsByVendorTable.table(tenantId, query);
  }

  /**
   * Retrieves the transactions by vendor in CSV format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   * @returns {Promise<string>}
   */
  public csv(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<string> {
    return this.transactionsByVendorExport.csv(tenantId, query);
  }

  /**
   * Retrieves the transactions by vendor in XLSX format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   */
  public xlsx(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<Buffer> {
    return this.transactionsByVendorExport.xlsx(tenantId, query);
  }
}
