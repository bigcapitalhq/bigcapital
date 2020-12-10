import { sumBy, chain } from 'lodash';
import {
  IJournalEntry,
  IJournalPoster,
  IJournalReportEntriesGroup,
  IJournalReportQuery,
  IJournalReport
} from "interfaces";
import FinancialSheet from "../FinancialSheet";

export default class JournalSheet extends FinancialSheet {
  tenantId: number;
  journal: IJournalPoster;
  query: IJournalReportQuery;
  baseCurrency: string;

  /**
   * Constructor method.
   * @param {number} tenantId 
   * @param {IJournalPoster} journal 
   */
  constructor(
    tenantId: number,
    query: IJournalReportQuery,
    journal: IJournalPoster,
    baseCurrency: string,
  ) {
    super();

    this.tenantId = tenantId;
    this.journal = journal;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.baseCurrency = baseCurrency;
  }

  /**
   * Mapping journal entries groups.
   * @param {IJournalEntry[]} entriesGroup -
   * @param {string} key -
   * @return {IJournalReportEntriesGroup}
   */
  entriesGroupMapper(
    entriesGroup: IJournalEntry[],
    key: string,
  ): IJournalReportEntriesGroup {
    const totalCredit = sumBy(entriesGroup, 'credit');
    const totalDebit = sumBy(entriesGroup, 'debit');

    return {
      id: key,
      entries: entriesGroup,
      
      currencyCode: this.baseCurrency,

      credit: totalCredit,
      debit: totalDebit,

      formattedCredit: this.formatNumber(totalCredit),
      formattedDebit: this.formatNumber(totalDebit),
    };
  }

  /**
   * Mapping the journal entries to entries groups.
   * @param {IJournalEntry[]} entries 
   * @return {IJournalReportEntriesGroup[]}
   */
  entriesWalker(entries: IJournalEntry[]): IJournalReportEntriesGroup[] {
    return chain(entries)
      .groupBy((entry) => `${entry.referenceId}-${entry.referenceType}`)
      .map((
        entriesGroup: IJournalEntry[],
        key: string
      ) => this.entriesGroupMapper(entriesGroup, key))
      .value();
  }

  /**
   * Retrieve journal report.
   * @return {IJournalReport}
   */
  reportData(): IJournalReport {
    return {
      entries: this.entriesWalker(this.journal.entries),
    };
  }
}