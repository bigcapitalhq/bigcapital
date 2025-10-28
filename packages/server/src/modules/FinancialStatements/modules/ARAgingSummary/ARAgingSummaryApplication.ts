import { Injectable } from '@nestjs/common';
import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';
import { ARAgingSummaryExportInjectable } from './ARAgingSummaryExportInjectable';
import { ARAgingSummaryService } from './ARAgingSummaryService';
import { ARAgingSummaryPdfInjectable } from './ARAgingSummaryPdfInjectable';
import { ARAgingSummaryQueryDto } from './ARAgingSummaryQuery.dto';

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
   * @param {ARAgingSummaryQueryDto} query
   */
  public sheet(query: ARAgingSummaryQueryDto) {
    return this.ARAgingSummarySheet.ARAgingSummary(query);
  }

  /**
   * Retrieve the A/R aging summary in table format.
   * @param {ARAgingSummaryQueryDto} query
   */
  public table(query: ARAgingSummaryQueryDto) {
    return this.ARAgingSummaryTable.table(query);
  }

  /**
   * Retrieve the A/R aging summary in XLSX format.
   * @param {ARAgingSummaryQueryDto} query
   */
  public xlsx(query: ARAgingSummaryQueryDto) {
    return this.ARAgingSummaryExport.xlsx(query);
  }

  /**
   * Retrieve the A/R aging summary in CSV format.
   * @param {ARAgingSummaryQueryDto} query
   */
  public csv(query: ARAgingSummaryQueryDto) {
    return this.ARAgingSummaryExport.csv(query);
  }

  /**
   * Retrieves the A/R aging summary in pdf format.
   * @param {ARAgingSummaryQueryDto} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: ARAgingSummaryQueryDto) {
    return this.ARAgingSummaryPdf.pdf(query);
  }
}
