import { Inject, Service } from 'typedi';
import moment from 'moment';
import { ICashFlowStatementMeta, ICashFlowStatementQuery } from '@/interfaces';
import { FinancialSheetMeta } from '../FinancialSheetMeta';

@Service()
export class CashflowSheetMeta {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * CAshflow sheet meta.
   * @param {number} tenantId
   * @param {ICashFlowStatementQuery} query
   * @returns {Promise<ICashFlowStatementMeta>}
   */
  public async meta(
    tenantId: number,
    query: ICashFlowStatementQuery
  ): Promise<ICashFlowStatementMeta> {
    const meta = await this.financialSheetMeta.meta(tenantId);
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
