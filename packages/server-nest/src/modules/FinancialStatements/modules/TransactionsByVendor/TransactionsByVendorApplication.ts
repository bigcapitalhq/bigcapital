import {
  ITransactionsByVendorTable,
  ITransactionsByVendorsFilter,
  ITransactionsByVendorsStatement,
} from './TransactionsByVendor.types';
import { TransactionsByVendorExportInjectable } from './TransactionsByVendorExportInjectable';
import { TransactionsByVendorTableInjectable } from './TransactionsByVendorTableInjectable';
import { TransactionsByVendorsInjectable } from './TransactionsByVendorInjectable';
import { TransactionsByVendorsPdf } from './TransactionsByVendorPdf';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsByVendorApplication {
  constructor(
    private readonly transactionsByVendorTable: TransactionsByVendorTableInjectable,
    private readonly transactionsByVendorExport: TransactionsByVendorExportInjectable,
    private readonly transactionsByVendorSheet: TransactionsByVendorsInjectable,
    private readonly transactionsByVendorPdf: TransactionsByVendorsPdf,
  ) {}

  /**
   * Retrieves the transactions by vendor in sheet format.
   * @param {ITransactionsByVendorsFilter} query - The filter query.
   * @returns {Promise<ITransactionsByVendorsStatement>}
   */
  public sheet(
    query: ITransactionsByVendorsFilter
  ): Promise<ITransactionsByVendorsStatement> {
    return this.transactionsByVendorSheet.transactionsByVendors(
      query
    );
  }

  /**
   * Retrieves the transactions by vendor in table format.
   * @param {ITransactionsByVendorsFilter} query
   * @returns {Promise<ITransactionsByVendorTable>}
   */
  public table(
    query: ITransactionsByVendorsFilter
  ): Promise<ITransactionsByVendorTable> {
    return this.transactionsByVendorTable.table(query);
  }

  /**
   * Retrieves the transactions by vendor in CSV format.
   * @param {ITransactionsByVendorsFilter} query
   * @returns {Promise<string>}
   */
  public csv(
    query: ITransactionsByVendorsFilter
  ): Promise<string> {
    return this.transactionsByVendorExport.csv(query);
  }

  /**
   * Retrieves the transactions by vendor in XLSX format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(
    query: ITransactionsByVendorsFilter
  ): Promise<Buffer> {
    return this.transactionsByVendorExport.xlsx(query);
  }

  /**
   * Retrieves the transactions by vendor in PDF format.
   * @param {number} tenantId
   * @param {ITransactionsByVendorsFilter} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: ITransactionsByVendorsFilter) {
    return this.transactionsByVendorPdf.pdf(query);
  }
}
