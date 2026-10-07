import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { I18nService } from 'nestjs-i18n';
import {
  IProfitLossSheetMeta,
  IProfitLossSheetQuery,
} from './ProfitLossSheet.types';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class ProfitLossSheetMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the P/L sheet meta.
   * @param {IProfitLossSheetQuery} query - P/L sheet query.
   * @returns {Promise<IBalanceSheetMeta>}
   */
  public async meta(
    query: IProfitLossSheetQuery,
  ): Promise<IProfitLossSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedToDate = moment(query.toDate).format(commonMeta.dateFormat);
    const formattedFromDate = moment(query.fromDate).format(
      commonMeta.dateFormat,
    );
    const fromLabel = this.i18n.t('financial_sheet.from_date');
    const toLabel = this.i18n.t('financial_sheet.to_date');
    const formattedDateRange = `${fromLabel} ${formattedFromDate} | ${toLabel} ${formattedToDate}`;

    const sheetName = this.i18n.t('profit_loss_sheet.sheet_name');

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
