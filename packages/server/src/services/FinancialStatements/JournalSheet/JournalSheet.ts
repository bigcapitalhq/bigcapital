import { sumBy, chain, get, head } from 'lodash';
import {
  IJournalEntry,
  IJournalPoster,
  IJournalReportEntriesGroup,
  IJournalReportQuery,
  IJournalReport,
  IContact,
} from '@/interfaces';
import FinancialSheet from '../FinancialSheet';

export default class JournalSheet extends FinancialSheet {
  readonly tenantId: number;
  readonly journal: IJournalPoster;
  readonly query: IJournalReportQuery;
  readonly baseCurrency: string;
  readonly contactsById: Map<number | string, IContact>;

  /**
   * Constructor method.
   * @param {number} tenantId
   * @param {IJournalPoster} journal
   */
  constructor(
    tenantId: number,
    query: IJournalReportQuery,
    journal: IJournalPoster,
    accountsGraph: any,
    contactsById: Map<number | string, IContact>,
    baseCurrency: string,
    i18n
  ) {
    super();

    this.tenantId = tenantId;
    this.journal = journal;
    this.query = query;
    this.numberFormat = this.query.numberFormat;
    this.accountsGraph = accountsGraph;
    this.contactsById = contactsById;
    this.baseCurrency = baseCurrency;
    this.i18n = i18n;
  }

  /**
   * Entry mapper.
   * @param {IJournalEntry} entry 
   */
  entryMapper(entry: IJournalEntry) {
    const account = this.accountsGraph.getNodeData(entry.accountId);
    const contact = this.contactsById.get(entry.contactId);

    return {
      entryId: entry.id,
      index: entry.index,
      note: entry.note,

      contactName: get(contact, 'displayName'),
      contactType: get(contact, 'contactService'),

      accountName: account.name,
      accountCode: account.code,
      transactionNumber: entry.transactionNumber,

      currencyCode: this.baseCurrency,
      formattedCredit: this.formatNumber(entry.credit),
      formattedDebit: this.formatNumber(entry.debit),

      credit: entry.credit,
      debit: entry.debit,

      createdAt: entry.createdAt,
    };
  }

  /**
   * Maps the journal entries.
   * @param {IJournalEntry[]} entries -
   */
  entriesMapper(entries: IJournalEntry[]) {
    return entries.map(this.entryMapper.bind(this));
  }

  /**
   * Mapping journal entries groups.
   * @param {IJournalEntry[]} entriesGroup -
   * @param {string} key -
   * @return {IJournalReportEntriesGroup}
   */
  entriesGroupsMapper(
    entriesGroup: IJournalEntry[],
    groupEntry: IJournalEntry
  ): IJournalReportEntriesGroup {
    const totalCredit = sumBy(entriesGroup, 'credit');
    const totalDebit = sumBy(entriesGroup, 'debit');

    return {
      date: groupEntry.date,
      referenceType: groupEntry.referenceType,
      referenceId: groupEntry.referenceId,
      referenceTypeFormatted: this.i18n.__(groupEntry.referenceTypeFormatted),

      entries: this.entriesMapper(entriesGroup),

      currencyCode: this.baseCurrency,

      credit: totalCredit,
      debit: totalDebit,

      formattedCredit: this.formatTotalNumber(totalCredit),
      formattedDebit: this.formatTotalNumber(totalDebit),
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
      .map((entriesGroup: IJournalEntry[], key: string) => {
        const headEntry = head(entriesGroup);
        return this.entriesGroupsMapper(entriesGroup, headEntry);
      })
      .value();
  }

  /**
   * Retrieve journal report.
   * @return {IJournalReport}
   */
  reportData(): IJournalReport {
    return this.entriesWalker(this.journal.entries);
  }
}
