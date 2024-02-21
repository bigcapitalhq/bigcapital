import { Inject, Service } from 'typedi';
import {
  ITransactionsByVendorTable,
  ITransactionsByVendorsFilter,
  ITransactionsByVendorsStatement,
} from '@/interfaces';
import { TransactionsByVendorExportInjectable } from './TransactionsByVendorExportInjectable';
import { TransactionsByVendorTableInjectable } from './TransactionsByVendorTableInjectable';
import { TransactionsByVendorsInjectable } from './TransactionsByVendorInjectable';
import { TransactionsByVendorsPdf } from './TransactionsByVendorPdf';

@Service()
export class TransactionsByVendorApplication {
  @Inject()
  private transactionsByVendorTable: TransactionsByVendorTableInjectable;

  @Inject()
  private transactionsByVendorExport: TransactionsByVendorExportInjectable;

  @Inject()
  private transactionsByVendorSheet: TransactionsByVendorsInjectable;

  @Inject()
  private transactionsByVendorPdf: TransactionsByVendorsPdf;

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
   * @returns {Promise<Buffer>}
   */
  public xlsx(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<Buffer> {
    return this.transactionsByVendorExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the transactions by vendor in PDF format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   * @returns {Promise<Buffer>}
   */
  public pdf(tenantId: number, query: ITransactionsByVendorsFilter) {
    return this.transactionsByVendorPdf.pdf(tenantId, query);
  }
}
