import moment from 'moment';
import {
  ICustomerBalanceSummaryMeta,
  ICustomerBalanceSummaryQuery,
} from './CustomerBalanceSummary.types';
import { Injectable } from '@nestjs/common';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class CustomerBalanceSummaryMeta {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieves the customer balance summary meta.
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<ICustomerBalanceSummaryMeta>}
   */
  async meta(
    query: ICustomerBalanceSummaryQuery,
  ): Promise<ICustomerBalanceSummaryMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
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
