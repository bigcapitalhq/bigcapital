import { Inject, Service } from 'typedi';
import { IAPAgingSummaryQuery, IAPAgingSummaryTable } from '@/interfaces';
import { APAgingSummaryService } from './APAgingSummaryService';
import APAgingSummaryTable from './APAgingSummaryTable';

@Service()
export class APAgingSummaryTableInjectable {
  @Inject()
  private APAgingSummarySheet: APAgingSummaryService;

  /**
   * Retrieves A/P aging summary in table format.
   * @param {number} tenantId
   * @param {IAPAgingSummaryQuery} query
   * @returns {Promise<IAPAgingSummaryTable>}
   */
  public async table(
    tenantId: number,
    query: IAPAgingSummaryQuery
  ): Promise<IAPAgingSummaryTable> {
    const report = await this.APAgingSummarySheet.APAgingSummary(
      tenantId,
      query
    );
    const table = new APAgingSummaryTable(report.data, query, {});

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      meta: report.meta,
      query: report.query,
    };
  }
}
