import { Inject, Service } from 'typedi';
import { APAgingSummaryExportInjectable } from './APAgingSummaryExportInjectable';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';
import { IAPAgingSummaryQuery } from '@/interfaces';
import { APAgingSummaryService } from './APAgingSummaryService';

@Service()
export class APAgingSummaryApplication {
  @Inject()
  private APAgingSummaryTable: APAgingSummaryTableInjectable;

  @Inject()
  private APAgingSummaryExport: APAgingSummaryExportInjectable;

  @Inject()
  private APAgingSummarySheet: APAgingSummaryService;

  /**
   * Retrieve the A/P aging summary in sheet format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public sheet(tenantId: number, query: IAPAgingSummaryQuery) {
    return this.APAgingSummarySheet.APAgingSummary(tenantId, query);
  }

  /**
   * Retrieve the A/P aging summary in table format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public table(tenantId: number, query: IAPAgingSummaryQuery) {
    return this.APAgingSummaryTable.table(tenantId, query);
  }

  /**
   * Retrieve the A/P aging summary in CSV format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public csv(tenantId: number, query: IAPAgingSummaryQuery) {
    return this.APAgingSummaryExport.csv(tenantId, query);
  }

  /**
   * Retrieve the A/P aging summary in XLSX format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   */
  public xlsx(tenantId: number, query: IAPAgingSummaryQuery) {
    return this.APAgingSummaryExport.xlsx(tenantId, query);
  }
}
