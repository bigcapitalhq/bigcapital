import moment from 'moment';
import { Inject, Service } from 'typedi';
import { FinancialSheetMeta } from '../FinancialSheetMeta';
import { ICashFlowStatementMeta, ICashFlowStatementQuery } from '@/interfaces';

@Service()
export class ProfitLossSheetMeta {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieve the P/L sheet meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    tenantId: number,
    query: ICashFlowStatementQuery
  ): Promise<ICashFlowStatementMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);
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
