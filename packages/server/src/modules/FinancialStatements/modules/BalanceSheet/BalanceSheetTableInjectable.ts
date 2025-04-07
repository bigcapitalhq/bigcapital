import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { BalanceSheetInjectable } from './BalanceSheetInjectable';
import { BalanceSheetTable } from './BalanceSheetTable';
import { IBalanceSheetQuery, IBalanceSheetTable } from './BalanceSheet.types';

@Injectable()
export class BalanceSheetTableInjectable {
  constructor(
    private readonly balanceSheetService: BalanceSheetInjectable,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * Retrieves the balance sheet in table format.
   * @param {number} query -
   * @returns {Promise<IBalanceSheetTable>}
   */
  public async table(filter: IBalanceSheetQuery): Promise<IBalanceSheetTable> {
    const { data, query, meta } =
      await this.balanceSheetService.balanceSheet(filter);

    const table = new BalanceSheetTable(data, query, this.i18nService);

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      query,
      meta,
    };
  }
}
