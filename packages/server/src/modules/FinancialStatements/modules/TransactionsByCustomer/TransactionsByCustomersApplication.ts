import {
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersStatement,
} from './TransactionsByCustomer.types';
import { TransactionsByCustomersTableInjectable } from './TransactionsByCustomersTableInjectable';
import { TransactionsByCustomersExportInjectable } from './TransactionsByCustomersExportInjectable';
import { TransactionsByCustomersSheet } from './TransactionsByCustomersService';
import { TransactionsByCustomersPdf } from './TransactionsByCustomersPdf';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsByCustomerApplication {
  constructor(
    private readonly transactionsByCustomersTable: TransactionsByCustomersTableInjectable,
    private readonly transactionsByCustomersExport: TransactionsByCustomersExportInjectable,
    private readonly transactionsByCustomersSheet: TransactionsByCustomersSheet,
    private readonly transactionsByCustomersPdf: TransactionsByCustomersPdf,
  ) {}
  /**
   * Retrieves the transactions by customers sheet in json format.
   * @param {ITransactionsByCustomersFilter} query - Transactions by customers filter.
   * @returns {Promise<ITransactionsByCustomersStatement>}
   */
  public sheet(
    query: ITransactionsByCustomersFilter,
  ): Promise<ITransactionsByCustomersStatement> {
    return this.transactionsByCustomersSheet.transactionsByCustomers(query);
  }

  /**
   * Retrieves the transactions by vendors sheet in table format.
   * @param {ITransactionsByCustomersFilter} query - Transactions by customers filter.
   * @returns {Promise<ITransactionsByCustomersTable>}
   */
  public table(query: ITransactionsByCustomersFilter) {
    return this.transactionsByCustomersTable.table(query);
  }

  /**
   * Retrieves the transactions by vendors sheet in CSV format.
   * @param {ITransactionsByCustomersFilter} query - Transactions by customers filter.
   * @returns {Promise<string>}
   */
  public csv(query: ITransactionsByCustomersFilter): Promise<string> {
    return this.transactionsByCustomersExport.csv(query);
  }

  /**
   * Retrieves the transactions by vendors sheet in XLSX format.
   * @param {number} tenantId
   * @param {ITransactionsByCustomersFilter} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: ITransactionsByCustomersFilter): Promise<Buffer> {
    return this.transactionsByCustomersExport.xlsx(query);
  }

  /**
   * Retrieves the transactions by vendors sheet in PDF format.
   * @param {ITransactionsByCustomersFilter} query - Transactions by customers filter.
   * @returns {Promise<Buffer>}
   */
  public pdf(query: ITransactionsByCustomersFilter): Promise<Buffer> {
    return this.transactionsByCustomersPdf.pdf(query);
  }
}
