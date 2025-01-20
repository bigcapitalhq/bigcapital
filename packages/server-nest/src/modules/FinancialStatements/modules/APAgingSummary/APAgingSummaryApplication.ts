import { APAgingSummaryExportInjectable } from './APAgingSummaryExportInjectable';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';
import { IAPAgingSummaryQuery } from './APAgingSummary.types';
import { APAgingSummaryService } from './APAgingSummaryService';
import { APAgingSummaryPdfInjectable } from './APAgingSummaryPdfInjectable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class APAgingSummaryApplication {
  constructor(
    private readonly APAgingSummaryTable: APAgingSummaryTableInjectable,
    private readonly APAgingSummaryExport: APAgingSummaryExportInjectable,
    private readonly APAgingSummarySheet: APAgingSummaryService,
    private readonly APAgingSumaryPdf: APAgingSummaryPdfInjectable,
  ) {}

  /**
   * Retrieve the A/P aging summary in sheet format.
   * @param {IAPAgingSummaryQuery} query
   */
  public sheet(query: IAPAgingSummaryQuery) {
    return this.APAgingSummarySheet.APAgingSummary(query);
  }

  /**
   * Retrieve the A/P aging summary in table format.
   * @param {IAPAgingSummaryQuery} query
   */
  public table(query: IAPAgingSummaryQuery) {
    return this.APAgingSummaryTable.table(query);
  }

  /**
   * Retrieve the A/P aging summary in CSV format.
   * @param {IAPAgingSummaryQuery} query
   */
  public csv(query: IAPAgingSummaryQuery) {
    return this.APAgingSummaryExport.csv(query);
  }

  /**
   * Retrieve the A/P aging summary in XLSX format.
   * @param {IAPAgingSummaryQuery} query
   */
  public xlsx(query: IAPAgingSummaryQuery) {
    return this.APAgingSummaryExport.xlsx(query);
  }

  /**
   * Retrieves the A/P aging summary in pdf format.
   * @param {IAPAgingSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: IAPAgingSummaryQuery) {
    return this.APAgingSumaryPdf.pdf(query);
  }
}
