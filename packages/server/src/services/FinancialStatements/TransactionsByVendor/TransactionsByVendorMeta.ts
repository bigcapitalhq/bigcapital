import moment from 'moment';
import { Inject, Service } from 'typedi';
import { FinancialSheetMeta } from '../FinancialSheetMeta';
import {
  ITransactionsByVendorMeta,
  ITransactionsByVendorsFilter,
} from '@/interfaces';

@Service()
export class TransactionsByVendorMeta {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieves the transactions by vendor meta.
   * @param {number} tenantId -
   * @returns {Promise<ITransactionsByVendorMeta>}
   */
  public async meta(
    tenantId: number,
    query: ITransactionsByVendorsFilter
  ): Promise<ITransactionsByVendorMeta> {
    const commonMeta = await this.financialSheetMeta.meta(tenantId);
    const formattedToDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDate}`;

    const sheetName = 'Transactions By Vendor';

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
