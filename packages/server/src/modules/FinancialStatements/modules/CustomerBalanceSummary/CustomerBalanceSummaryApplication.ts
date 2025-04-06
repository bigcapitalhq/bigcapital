import { CustomerBalanceSummaryExportInjectable } from './CustomerBalanceSummaryExportInjectable';
import { CustomerBalanceSummaryTableInjectable } from './CustomerBalanceSummaryTableInjectable';
import { ICustomerBalanceSummaryQuery } from './CustomerBalanceSummary.types';
import { CustomerBalanceSummaryService } from './CustomerBalanceSummaryService';
import { CustomerBalanceSummaryPdf } from './CustomerBalanceSummaryPdf';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerBalanceSummaryApplication {
  constructor(
    private readonly customerBalanceSummaryTable: CustomerBalanceSummaryTableInjectable,
    private readonly customerBalanceSummaryExport: CustomerBalanceSummaryExportInjectable,
    private readonly customerBalanceSummarySheet: CustomerBalanceSummaryService,
    private readonly customerBalanceSummaryPdf: CustomerBalanceSummaryPdf,
  ) {}

  /**
   * Retrieves the customer balance sheet in json format.
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<ICustomerBalanceSummarySheet>}
   */
  public sheet(query: ICustomerBalanceSummaryQuery) {
    return this.customerBalanceSummarySheet.customerBalanceSummary(query);
  }

  /**
   * Retrieves the customer balance sheet in json format.
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<ICustomerBalanceSummaryTable>}
   */
  public table(query: ICustomerBalanceSummaryQuery) {
    return this.customerBalanceSummaryTable.table(query);
  }

  /**
   * Retrieves the customer balance sheet in XLSX format.
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public xlsx(query: ICustomerBalanceSummaryQuery) {
    return this.customerBalanceSummaryExport.xlsx(query);
  }

  /**
   * Retrieves the customer balance sheet in CSV format.
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public csv(query: ICustomerBalanceSummaryQuery) {
    return this.customerBalanceSummaryExport.csv(query);
  }

  /**
   * Retrieves the customer balance sheet in PDF format.
   * @param {number} tenantId
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: ICustomerBalanceSummaryQuery) {
    return this.customerBalanceSummaryPdf.pdf(query);
  }
}
