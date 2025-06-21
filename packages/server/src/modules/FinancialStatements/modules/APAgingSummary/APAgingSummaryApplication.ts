import { Injectable } from '@nestjs/common';
import { APAgingSummaryExportInjectable } from './APAgingSummaryExportInjectable';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';
import { APAgingSummaryService } from './APAgingSummaryService';
import { APAgingSummaryPdfInjectable } from './APAgingSummaryPdfInjectable';
import { APAgingSummaryQueryDto } from './APAgingSummaryQuery.dto';

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
   * @param {APAgingSummaryQueryDto} query
   */
  public sheet(query: APAgingSummaryQueryDto) {
    return this.APAgingSummarySheet.APAgingSummary(query);
  }

  /**
   * Retrieve the A/P aging summary in table format.
   * @param {APAgingSummaryQueryDto} query
   */
  public table(query: APAgingSummaryQueryDto) {
    return this.APAgingSummaryTable.table(query);
  }

  /**
   * Retrieve the A/P aging summary in CSV format.
   * @param {APAgingSummaryQueryDto} query
   */
  public csv(query: APAgingSummaryQueryDto) {
    return this.APAgingSummaryExport.csv(query);
  }

  /**
   * Retrieve the A/P aging summary in XLSX format.
   * @param {APAgingSummaryQueryDto} query
   */
  public xlsx(query: APAgingSummaryQueryDto) {
    return this.APAgingSummaryExport.xlsx(query);
  }

  /**
   * Retrieves the A/P aging summary in pdf format.
   * @param {APAgingSummaryQueryDto} query
   * @returns {Promise<Buffer>}
   */
  public pdf(query: APAgingSummaryQueryDto) {
    return this.APAgingSumaryPdf.pdf(query);
  }
}
