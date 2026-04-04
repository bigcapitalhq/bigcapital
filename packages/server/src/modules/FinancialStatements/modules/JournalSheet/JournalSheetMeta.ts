import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { FinancialSheetMeta } from '../../common/FinancialSheetMeta';
import { IJournalReportQuery, IJournalSheetMeta } from './JournalSheet.types';

@Injectable()
export class JournalSheetMeta {
  constructor(private readonly financialSheetMeta: FinancialSheetMeta) {}

  /**
   * Retrieves the journal sheet meta.
   * @param {IJournalReportQuery} query -
   * @returns {Promise<IJournalSheetMeta>}
   */
  public async meta(query: IJournalReportQuery): Promise<IJournalSheetMeta> {
    const common = await this.financialSheetMeta.meta();

    const formattedToDate = moment(query.toDate).format(common.dateFormat);
    const formattedFromDate = moment(query.fromDate).format(common.dateFormat);
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDate}`;

    return {
      ...common,
      formattedDateRange,
      formattedFromDate,
      formattedToDate,
    };
  }
}
