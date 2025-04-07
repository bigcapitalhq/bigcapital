import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import {
  ICashFlowStatementMeta,
  ICashFlowStatementQuery,
} from './Cashflow.types';

@Injectable()
export class CashflowSheetMeta {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Cashflow sheet meta.
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<ICashFlowStatementMeta>}
   */
  public async meta(
    query: ICashFlowStatementQuery,
  ): Promise<ICashFlowStatementMeta> {
    const meta = await this.financialSheetMeta.meta();
    const formattedToDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDate}`;

    const sheetName = 'Statement of Cash Flow';

    return {
      ...meta,
      sheetName,
      formattedToDate,
      formattedFromDate,
      formattedDateRange,
    };
  }
}
