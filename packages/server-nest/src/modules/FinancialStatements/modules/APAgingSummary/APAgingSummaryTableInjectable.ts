import {
  IAPAgingSummaryQuery,
  IAPAgingSummaryTable,
} from './APAgingSummary.types';
import { APAgingSummaryService } from './APAgingSummaryService';
import { APAgingSummaryTable } from './APAgingSummaryTable';
import { Injectable } from '@nestjs/common';

@Injectable()
export class APAgingSummaryTableInjectable {
  constructor(private readonly APAgingSummarySheet: APAgingSummaryService) {}

  /**
   * Retrieves A/P aging summary in table format.
   * @param {IAPAgingSummaryQuery} query - 
   * @returns {Promise<IAPAgingSummaryTable>}
   */
  public async table(
    query: IAPAgingSummaryQuery,
  ): Promise<IAPAgingSummaryTable> {
    const report = await this.APAgingSummarySheet.APAgingSummary(query);
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
