import * as moment from 'moment';
import { ITrialBalanceSheetMeta, ITrialBalanceSheetQuery } from './TrialBalanceSheet.types';
import { Injectable } from '@nestjs/common';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
@Injectable()
export class TrialBalanceSheetMeta {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieves the trial balance sheet meta.
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<ITrialBalanceSheetMeta>}
   */
  public async meta(
    query: ITrialBalanceSheetQuery
  ): Promise<ITrialBalanceSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta();

    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedToDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} to ${formattedToDate}`;

    const sheetName = 'Trial Balance Sheet';

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
