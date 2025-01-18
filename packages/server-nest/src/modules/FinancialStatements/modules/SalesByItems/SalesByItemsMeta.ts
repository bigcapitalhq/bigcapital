import moment from 'moment';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import { ISalesByItemsReportQuery, ISalesByItemsSheetMeta } from './SalesByItems.types';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class SalesByItemsMeta {
  constructor(
    private financialSheetMeta: FinancialSheetMeta,
    private i18n: I18nService,
  ) {}

  /**
   * Retrieve the sales by items meta.
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    query: ISalesByItemsReportQuery
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
