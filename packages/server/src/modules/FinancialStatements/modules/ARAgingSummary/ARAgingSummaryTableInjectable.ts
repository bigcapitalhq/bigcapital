import { ARAgingSummaryTable } from './ARAgingSummaryTable';
import { ARAgingSummaryService } from './ARAgingSummaryService';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { IARAgingSummaryTable } from './ARAgingSummary.types';
import { ARAgingSummaryQueryDto } from './ARAgingSummaryQuery.dto';

@Injectable()
export class ARAgingSummaryTableInjectable {
  constructor(
    private readonly ARAgingSummarySheet: ARAgingSummaryService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves A/R aging summary in table format.
   * @param {ARAgingSummaryQueryDto} query - Aging summary query.
   * @returns {Promise<IARAgingSummaryTable>}
   */
  public async table(
    query: ARAgingSummaryQueryDto,
  ): Promise<IARAgingSummaryTable> {
    const report = await this.ARAgingSummarySheet.ARAgingSummary(query);
    // The report resolves the query defaults (aging periods, days before), and
    // the columns must be built from them, otherwise a request that omits the
    // aging parameters renders no aging-period headers.
    const table = new ARAgingSummaryTable(report.data, report.query, this.i18n);

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
