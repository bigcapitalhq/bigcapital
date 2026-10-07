import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import { IAgingSummaryMeta, IAgingSummaryQuery } from './AgingSummary.types';

@Injectable()
export class AgingSummaryMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve the aging summary meta.
   * @returns {IBalanceSheetMeta}
   */
  public async meta(query: IAgingSummaryQuery): Promise<IAgingSummaryMeta> {
    const commonMeta = await this.financialSheetMeta.meta();
    const formattedAsDate = moment(query.asDate).format(commonMeta.dateFormat);
    const asLabel = this.i18n.t('financial_sheet.as_date');
    const formattedDateRange = `${asLabel} ${formattedAsDate}`;

    return {
      ...commonMeta,
      sheetName: this.i18n.t('aging_summary.ap_sheet_name'),
      formattedAsDate,
      formattedDateRange,
    };
  }
}
