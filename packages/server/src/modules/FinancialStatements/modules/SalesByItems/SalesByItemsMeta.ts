import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import {
  ISalesByItemsReportQuery,
  ISalesByItemsSheetMeta,
} from './SalesByItems.types';

@Injectable()
export class SalesByItemsMeta {
  constructor(private financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieve the sales by items meta.
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    query: ISalesByItemsReportQuery,
  ): Promise<ISalesByItemsSheetMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedToDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDate}`;

    const sheetName = 'Sales By Items';

    return {
      ...commonMeta,
      sheetName,
      formattedFromDate,
      formattedToDate,
      formattedDateRange,
    };
  }
}
