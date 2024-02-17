import moment from 'moment';
import { Inject, Service } from 'typedi';
import {
  ICustomerBalanceSummaryMeta,
  ICustomerBalanceSummaryQuery,
} from '@/interfaces';
import { FinancialSheetMeta } from '../FinancialSheetMeta';

@Service()
export class CustomerBalanceSummaryMeta {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieves the customer balance summary meta.
   * @param {number} tenantId
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<ICustomerBalanceSummaryMeta>}
   */
  async meta(
    tenantId: number,
    query: ICustomerBalanceSummaryQuery
  ): Promise<ICustomerBalanceSummaryMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);
    const formattedAsDate = moment(query.asDate).format('YYYY/MM/DD');
    const formattedDateRange = `As ${formattedAsDate}`;

    return {
      ...commonMeta,
      sheetName: 'Customer Balance Summary',
      formattedAsDate,
      formattedDateRange,
    };
  }
}
