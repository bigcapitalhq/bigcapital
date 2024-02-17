import { Inject } from 'typedi';
import { FinancialSheetMeta } from '../FinancialSheetMeta';
import { IAgingSummaryMeta, IAgingSummaryQuery } from '@/interfaces';
import moment from 'moment';

export class AgingSummaryMeta {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieve the aging summary meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    tenantId: number,
    query: IAgingSummaryQuery
  ): Promise<IAgingSummaryMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);
    const formattedAsDate = moment(query.asDate).format('YYYY/MM/DD');
    const formattedDateRange = `As ${formattedAsDate}`;

    return {
      ...commonMeta,
      sheetName: 'A/P Aging Summary',
      formattedAsDate,
      formattedDateRange,
    };
  }
}
