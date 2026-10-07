import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  IVendorBalanceSummaryMeta,
  IVendorBalanceSummaryQuery,
} from './VendorBalanceSummary.types';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';

@Injectable()
export class VendorBalanceSummaryMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the vendor balance summary meta.
   * @param {IVendorBalanceSummaryQuery} query - Query.
   * @returns {IBalanceSheetMeta}
   */
  public async meta(
    query: IVendorBalanceSummaryQuery,
  ): Promise<IVendorBalanceSummaryMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedAsDate = moment(query.asDate).format(commonMeta.dateFormat);

    return {
      ...commonMeta,
      sheetName: this.i18n.t('contact_summary_balance.vendor_sheet_name'),
      formattedAsDate,
    };
  }
}
