import { Inject, Service } from 'typedi';
import moment from 'moment';
import { ITrialBalanceSheetMeta, ITrialBalanceSheetQuery } from '@/interfaces';
import { FinancialSheetMeta } from '../FinancialSheetMeta';

@Service()
export class TrialBalanceSheetMeta {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieves the trial balance sheet meta.
   * @param {number} tenantId
   * @param {ITrialBalanceSheetQuery} query
   * @returns {Promise<ITrialBalanceSheetMeta>}
   */
  public async meta(
    tenantId: number,
    query: ITrialBalanceSheetQuery
  ): Promise<ITrialBalanceSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);

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
