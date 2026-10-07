import * as moment from 'moment';
import {
  ITrialBalanceSheetMeta,
  ITrialBalanceSheetQuery,
} from './TrialBalanceSheet.types';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
@Injectable()
export class TrialBalanceSheetMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the trial balance sheet meta.
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<ITrialBalanceSheetMeta>}
   */
  public async meta(
    query: ITrialBalanceSheetQuery,
  ): Promise<ITrialBalanceSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta();

    const formattedFromDate = moment(query.fromDate).format(
      commonMeta.dateFormat,
    );
    const formattedToDate = moment(query.toDate).format(commonMeta.dateFormat);
    const fromLabel = this.i18n.t('financial_sheet.from_date');
    const toLabel = this.i18n.t('financial_sheet.to_date');
    const formattedDateRange = `${fromLabel} ${formattedFromDate} | ${toLabel} ${formattedToDate}`;

    const sheetName = this.i18n.t('trial_balance_sheet.sheet_name');

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
