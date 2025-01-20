import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';
import { ARAgingSummaryExportInjectable } from './ARAgingSummaryExportInjectable';
import { ARAgingSummaryService } from './ARAgingSummaryService';
import { ARAgingSummaryPdfInjectable } from './ARAgingSummaryPdfInjectable';
import { IARAgingSummaryQuery } from './ARAgingSummary.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ARAgingSummaryApplication {
  constructor(
    private readonly ARAgingSummaryTable: ARAgingSummaryTableInjectable,
    private readonly ARAgingSummaryExport: ARAgingSummaryExportInjectable,
    private readonly ARAgingSummarySheet: ARAgingSummaryService,
    private readonly ARAgingSummaryPdf: ARAgingSummaryPdfInjectable,
  ) {}

  /**
   * Retrieve the A/R aging summary sheet.
   * @param {IAPAgingSummaryQuery} query
   */
  public sheet(query: IARAgingSummaryQuery) {
    return this.ARAgingSummarySheet.ARAgingSummary(query);
  }

  /**
   * Retrieve the A/R aging summary in table format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public table(query: IARAgingSummaryQuery) {
    return this.ARAgingSummaryTable.table(query);
  }

  /**
   * Retrieve the A/R aging summary in XLSX format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public xlsx(query: IARAgingSummaryQuery) {
    return this.ARAgingSummaryExport.xlsx(query);
  }

  /**
   * Retrieve the A/R aging summary in CSV format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public csv(query: IARAgingSummaryQuery) {
    return this.ARAgingSummaryExport.csv(query);
  }

  /**
   * Retrieves the A/R aging summary in pdf format.
   * @param {IARAgingSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IARAgingSummaryQuery) {
    return this.ARAgingSummaryPdf.pdf(query);
  }
}
