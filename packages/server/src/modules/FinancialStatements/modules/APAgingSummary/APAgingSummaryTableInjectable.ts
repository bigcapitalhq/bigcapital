import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { IAPAgingSummaryTable } from './APAgingSummary.types';
import { APAgingSummaryService } from './APAgingSummaryService';
import { APAgingSummaryTable } from './APAgingSummaryTable';
import { APAgingSummaryQueryDto } from './APAgingSummaryQuery.dto';

@Injectable()
export class APAgingSummaryTableInjectable {
  constructor(
    private readonly APAgingSummarySheet: APAgingSummaryService,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Retrieves A/P aging summary in table format.
   * @param {APAgingSummaryQueryDto} query -
   * @returns {Promise<IAPAgingSummaryTable>}
   */
  public async table(
    query: APAgingSummaryQueryDto,
  ): Promise<IAPAgingSummaryTable> {
    const report = await this.APAgingSummarySheet.APAgingSummary(query);
    const table = new APAgingSummaryTable(report.data, query, this.i18nService);

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
