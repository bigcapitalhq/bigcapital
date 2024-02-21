import { Inject, Service } from 'typedi';
import { IARAgingSummaryQuery } from '@/interfaces';
import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';
import { ARAgingSummaryExportInjectable } from './ARAgingSummaryExportInjectable';
import ARAgingSummaryService from './ARAgingSummaryService';
import { ARAgingSummaryPdfInjectable } from './ARAgingSummaryPdfInjectable';

@Service()
export class ARAgingSummaryApplication {
  @Inject()
  private ARAgingSummaryTable: ARAgingSummaryTableInjectable;

  @Inject()
  private ARAgingSummaryExport: ARAgingSummaryExportInjectable;

  @Inject()
  private ARAgingSummarySheet: ARAgingSummaryService;

  @Inject()
  private ARAgingSummaryPdf: ARAgingSummaryPdfInjectable;

  /**
   * Retrieve the A/R aging summary sheet.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public sheet(tenantId: number, query: IARAgingSummaryQuery) {
    return this.ARAgingSummarySheet.ARAgingSummary(tenantId, query);
  }

  /**
   * Retrieve the A/R aging summary in table format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public table(tenantId: number, query: IARAgingSummaryQuery) {
    return this.ARAgingSummaryTable.table(tenantId, query);
  }

  /**
   * Retrieve the A/R aging summary in XLSX format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public xlsx(tenantId: number, query: IARAgingSummaryQuery) {
    return this.ARAgingSummaryExport.xlsx(tenantId, query);
  }

  /**
   * Retrieve the A/R aging summary in CSV format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public csv(tenantId: number, query: IARAgingSummaryQuery) {
    return this.ARAgingSummaryExport.csv(tenantId, query);
  }

  /**
   * Retrieves the A/R aging summary in pdf format.
   * @param {number} tenantId
   * @param {IARAgingSummaryQuery} query
   * @returns {Promise<Buffer>}
   */
  public pdf(tenantId: number, query: IARAgingSummaryQuery) {
    return this.ARAgingSummaryPdf.pdf(tenantId, query);
  }
}
