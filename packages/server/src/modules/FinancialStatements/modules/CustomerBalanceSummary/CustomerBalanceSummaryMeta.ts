import * as moment from 'moment';
import {
  ICustomerBalanceSummaryMeta,
  ICustomerBalanceSummaryQuery,
} from './CustomerBalanceSummary.types';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class CustomerBalanceSummaryMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the customer balance summary meta.
   * @param {ICustomerBalanceSummaryQuery} query
   * @returns {Promise<ICustomerBalanceSummaryMeta>}
   */
  async meta(
    query: ICustomerBalanceSummaryQuery,
  ): Promise<ICustomerBalanceSummaryMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedAsDate = moment(query.asDate).format(commonMeta.dateFormat);
    const asLabel = this.i18n.t('financial_sheet.as_date');
    const formattedDateRange = `${asLabel} ${formattedAsDate}`;

    return {
      ...commonMeta,
      sheetName: this.i18n.t('contact_summary_balance.customer_sheet_name'),
      formattedAsDate,
      formattedDateRange,
    };
  }
}
