import moment from 'moment';
import { Inject, Service } from 'typedi';
import { FinancialSheetMeta } from '../FinancialSheetMeta';
import {
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersMeta,
} from '@/interfaces';

@Service()
export class TransactionsByCustomersMeta {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieves the transactions by customers meta.
   * @param {number} tenantId -
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    tenantId: number,
    query: ITransactionsByCustomersFilter
  ): Promise<ITransactionsByCustomersMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);
    const formattedToDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDate}`;

    return {
      ...commonMeta,
      sheetName: 'Transactions By Customers',
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
