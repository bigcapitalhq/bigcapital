import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import { IJournalReportQuery, IJournalSheetMeta } from './JournalSheet.types';

@Injectable()
export class JournalSheetMeta {
  constructor(
    private readonly financialSheetMeta: FinancialSheetMeta,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the journal sheet meta.
   * @param {IJournalReportQuery} query -
   * @returns {Promise<IJournalSheetMeta>}
   */
  public async meta(query: IJournalReportQuery): Promise<IJournalSheetMeta> {
    const common = await this.financialSheetMeta.meta();

    const formattedToDate = moment(query.toDate).format(common.dateFormat);
    const formattedFromDate = moment(query.fromDate).format(common.dateFormat);
    const fromLabel = this.i18n.t('financial_sheet.from_date');
    const toLabel = this.i18n.t('financial_sheet.to_date');
    const formattedDateRange = `${fromLabel} ${formattedFromDate} | ${toLabel} ${formattedToDate}`;

    return {
      ...common,
      formattedDateRange,
      formattedFromDate,
      formattedToDate,
    };
  }
}
