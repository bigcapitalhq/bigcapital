import { Inject, Service } from 'typedi';
import { FinancialSheetMeta } from '../FinancialSheetMeta';
import { IBalanceSheetMeta, IBalanceSheetQuery } from '@/interfaces';
import moment from 'moment';

@Service()
export class BalanceSheetMetaInjectable {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieve the balance sheet meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    tenantId: number,
    query: IBalanceSheetQuery
  ): Promise<IBalanceSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);
    const formattedAsDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedDateRange = `As ${formattedAsDate}`;
    const sheetName = 'Balance Sheet Statement';

    return {
      ...commonMeta,
      sheetName,
      formattedAsDate,
      formattedDateRange,
    };
  }
}
