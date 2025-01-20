import { ARAgingSummaryTable } from './ARAgingSummaryTable';
import { ARAgingSummaryService } from './ARAgingSummaryService';
import { Injectable } from '@nestjs/common';
import {
  IARAgingSummaryQuery,
  IARAgingSummaryTable,
} from './ARAgingSummary.types';

@Injectable()
export class ARAgingSummaryTableInjectable {
  constructor(private readonly ARAgingSummarySheet: ARAgingSummaryService) {}

  /**
   * Retrieves A/R aging summary in table format.
   * @param {IARAgingSummaryQuery} query - Aging summary query.
   * @returns {Promise<IARAgingSummaryTable>}
   */
  public async table(
    query: IARAgingSummaryQuery,
  ): Promise<IARAgingSummaryTable> {
    const report = await this.ARAgingSummarySheet.ARAgingSummary(query);
    const table = new ARAgingSummaryTable(report.data, query, {});

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      meta: report.meta,
      query,
    };
  }
}
