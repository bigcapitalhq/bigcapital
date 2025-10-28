import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import {
  IProfitLossSheetMeta,
  IProfitLossSheetQuery,
} from './ProfitLossSheet.types';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class ProfitLossSheetMeta {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieve the P/L sheet meta.
   * @param {IProfitLossSheetQuery} query - P/L sheet query.
   * @returns {Promise<IBalanceSheetMeta>}
   */
  public async meta(
    query: IProfitLossSheetQuery,
  ): Promise<IProfitLossSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedToDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDate}`;

    const sheetName = 'Cashflow Statement';

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
