import { Injectable } from '@nestjs/common';
import {
  ITrialBalanceSheetQuery,
  ITrialBalanceSheetTable,
} from './TrialBalanceSheet.types';
import { TrialBalanceSheetTable } from './TrialBalanceSheetTable';
import { TrialBalanceSheetService } from './TrialBalanceSheetInjectable';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TrialBalanceSheetTableInjectable {
  constructor(
    private readonly sheet: TrialBalanceSheetService,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the trial balance sheet table.
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<ITrialBalanceSheetTable>}
   */
  public async table(
    query: ITrialBalanceSheetQuery,
  ): Promise<ITrialBalanceSheetTable> {
    const trialBalance = await this.sheet.trialBalanceSheet(query);
    const table = new TrialBalanceSheetTable(
      trialBalance.data,
      query,
      this.i18n,
    );

    return {
      table: {
        columns: table.tableColumns(),
        rows: table.tableRows(),
      },
      meta: trialBalance.meta,
      query: trialBalance.query,
    };
  }
}
