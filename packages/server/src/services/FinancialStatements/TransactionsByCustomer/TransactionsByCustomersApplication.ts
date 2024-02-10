import { Inject, Service } from 'typedi';
import {
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersStatement,
} from '@/interfaces';
import { TransactionsByCustomersTableInjectable } from './TransactionsByCustomersTableInjectable';
import { TransactionsByCustomersExportInjectable } from './TransactionsByCustomersExportInjectable';
import { TransactionsByCustomersSheet } from './TransactionsByCustomersService';
import { TransactionsByCustomersPdf } from './TransactionsByCustomersPdf';

@Service()
export class TransactionsByCustomerApplication {
  @Inject()
  private transactionsByCustomersTable: TransactionsByCustomersTableInjectable;

  @Inject()
  private transactionsByCustomersExport: TransactionsByCustomersExportInjectable;

  @Inject()
  private transactionsByCustomersSheet: TransactionsByCustomersSheet;

  @Inject()
  private transactionsByCustomersPdf: TransactionsByCustomersPdf;

  /**
   * Retrieves the transactions by customers sheet in json format.
   * @param {number} tenantId
   * @param {ITransactionsByCustomersFilter} query
   * @returns {Promise<ITransactionsByCustomersStatement>}
   */
  public sheet(
    tenantId: number,
    query: ITransactionsByCustomersFilter
  ): Promise<ITransactionsByCustomersStatement> {
    return this.transactionsByCustomersSheet.transactionsByCustomers(
      tenantId,
      query
    );
  }

  /**
   * Retrieves the transactions by vendors sheet in table format.
   * @param {number} tenantId
   * @param {ITransactionsByCustomersFilter} query
   * @returns {Promise<ITransactionsByCustomersTable>}
   */
  public table(tenantId: number, query: ITransactionsByCustomersFilter) {
    return this.transactionsByCustomersTable.table(tenantId, query);
  }

  /**
   * Retrieves the transactions by vendors sheet in CSV format.
   * @param {number} tenantId
   * @param {ITransactionsByCustomersFilter} query
   * @returns {Promise<string>}
   */
  public csv(
    tenantId: number,
    query: ITransactionsByCustomersFilter
  ): Promise<string> {
    return this.transactionsByCustomersExport.csv(tenantId, query);
  }

  /**
   * Retrieves the transactions by vendors sheet in XLSX format.
   * @param {number} tenantId
   * @param {ITransactionsByCustomersFilter} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(
    tenantId: number,
    query: ITransactionsByCustomersFilter
  ): Promise<Buffer> {
    return this.transactionsByCustomersExport.xlsx(tenantId, query);
  }

  /**
   * Retrieves the transactions by vendors sheet in PDF format.
   * @param {number} tenantId
   * @param {ITransactionsByCustomersFilter} query
   * @returns {Promise<Buffer>}
   */
  public pdf(
    tenantId: number,
    query: ITransactionsByCustomersFilter
  ): Promise<Buffer> {
    return this.transactionsByCustomersPdf.pdf(tenantId, query);
  }
}
