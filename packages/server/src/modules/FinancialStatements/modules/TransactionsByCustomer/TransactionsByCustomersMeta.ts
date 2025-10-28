import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import {
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersMeta,
} from './TransactionsByCustomer.types';

@Injectable()
export class TransactionsByCustomersMeta {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieves the transactions by customers meta.
   * @param {ITransactionsByCustomersFilter} query - Transactions by customers filter.
   * @returns {ITransactionsByCustomersMeta}
   */
  public async meta(
    query: ITransactionsByCustomersFilter,
  ): Promise<ITransactionsByCustomersMeta> {
    const commonMeta = await this.financialSheetMeta.meta();

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
