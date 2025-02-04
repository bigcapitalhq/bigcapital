import { Injectable } from '@nestjs/common';
import { ProfitLossSheetService } from './ProfitLossSheetService';
import { ProfitLossSheetTable } from './ProfitLossSheetTable';
import {
  IProfitLossSheetQuery,
  IProfitLossSheetTable,
} from './ProfitLossSheet.types';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProfitLossSheetTableInjectable {
  constructor(
    private readonly i18n: I18nService,
    private readonly profitLossSheet: ProfitLossSheetService,
  ) {}

  /**
   * Retrieves the profit/loss sheet in table format.
   * @param {IProfitLossSheetQuery} filter - Profit/loss sheet query.
   * @returns {Promise<IProfitLossSheetTable>}
   */
  public async table(
    filter: IProfitLossSheetQuery,
  ): Promise<IProfitLossSheetTable> {
    const { data, query, meta } =
      await this.profitLossSheet.profitLossSheet(filter);

    const table = new ProfitLossSheetTable(data, query, this.i18n);

    return {
      table: {
        rows: table.tableRows(),
        columns: table.tableColumns(),
      },
      query,
      meta,
    };
  }
}
