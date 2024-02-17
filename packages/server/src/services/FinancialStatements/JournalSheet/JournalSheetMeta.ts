import { Service, Inject } from 'typedi';
import { FinancialSheetMeta } from '../FinancialSheetMeta';
import moment from 'moment';
import { IJournalReportQuery, IJournalSheetMeta } from '@/interfaces';

@Service()
export class JournalSheetMeta {
  @Inject()
  private financialSheetMeta: FinancialSheetMeta;

  /**
   * Retrieves the journal sheet meta.
   * @param {number} tenantId 
   * @param {IJournalReportQuery} query 
   * @returns {Promise<IJournalSheetMeta>}
   */
  public async meta(
    tenantId: number,
    query: IJournalReportQuery
  ): Promise<IJournalSheetMeta> {
    const common = await this.financialSheetMeta.meta(tenantId);
    const formattedToDate = moment(query.toDate).format('YYYY/MM/DD');
    const formattedFromDate = moment(query.fromDate).format('YYYY/MM/DD');
    const formattedDateRange = `From ${formattedFromDate} | To ${formattedToDate}`;

    return {
      ...common,
      formattedDateRange,
      formattedFromDate,
      formattedToDate,
    };
  }
}

