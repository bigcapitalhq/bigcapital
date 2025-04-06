import * as moment from 'moment';
import {
  ITransactionsByVendorMeta,
  ITransactionsByVendorsFilter,
} from './TransactionsByVendor.types';
import { Injectable } from '@nestjs/common';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class TransactionsByVendorMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
  ) {}

  /**
   * Retrieves the transactions by vendor meta.
   * @returns {Promise<ITransactionsByVendorMeta>}
   */
  public async meta(
    query: ITransactionsByVendorsFilter
  ): Promise<ITransactionsByVendorMeta> {
    const commonMeta = await this.financialSheetMeta.meta();

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
