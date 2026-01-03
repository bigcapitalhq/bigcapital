import { I18nService } from 'nestjs-i18n';
import { sumBy, chain, get, head } from 'lodash';
import * as moment from 'moment';
import {
  IJournalReportEntriesGroup,
  IJournalReportQuery,
  IJournalSheetEntry,
  IJournalTableData,
} from './JournalSheet.types';
import { FinancialSheet } from '../../common/FinancialSheet';
import { JournalSheetRepository } from './JournalSheetRepository';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { getTransactionTypeLabel } from '@/modules/BankingTransactions/utils';

export class JournalSheet extends FinancialSheet {
  readonly query: IJournalReportQuery;
  readonly repository: JournalSheetRepository;
  readonly i18n: I18nService;

  /**
   * Constructor method.
   * @param {IJournalReportQuery} query -
   * @param {JournalSheetRepository} repository -
   * @param {I18nService} i18n -
   */
  constructor(
    query: IJournalReportQuery,
    repository: JournalSheetRepository,
    i18n: I18nService,
  ) {
    super();

    this.query = query;
    this.repository = repository;
    this.numberFormat = {
      ...this.numberFormat,
      ...this.query.numberFormat,
    };
    this.i18n = i18n;
  }

  /**
   * Entry mapper.
   * @param {ILedgerEntry} entry
   */
  entryMapper(entry: ILedgerEntry): IJournalSheetEntry {
    const account = this.repository.accountsGraph.getNodeData(entry.accountId);
    const contact = this.repository.contactsById.get(entry.contactId);

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
   * maps the journal entries.
   * @param {IJournalEntry[]} entries -
   */
  entriesMapper(entries: ILedgerEntry[]): Array<IJournalSheetEntry> {
    return entries.map(this.entryMapper.bind(this));
  }

  /**
   * Mapping journal entries groups.
   * @param {ILedgerEntry[]} entriesGroup -
   * @param {ILedgerEntry} key -
   * @return {IJournalReportEntriesGroup}
   */
  entriesGroupsMapper(
    entriesGroup: ILedgerEntry[],
    groupEntry: ILedgerEntry,
  ): IJournalReportEntriesGroup {
    const totalCredit = sumBy(entriesGroup, 'credit');
    const totalDebit = sumBy(entriesGroup, 'debit');

    return {
      date: moment(groupEntry.date).toDate(),
      dateFormatted: moment(groupEntry.date).format('YYYY MMM DD'),

      transactionType: groupEntry.transactionType,
      referenceId: groupEntry.transactionId,
      referenceTypeFormatted: this.i18n.t(
        getTransactionTypeLabel(
          groupEntry.transactionType,
          groupEntry.transactionSubType,
        ),
      ),
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
  entriesWalker(entries: ILedgerEntry[]): IJournalReportEntriesGroup[] {
    return chain(entries)
      .groupBy((entry) => `${entry.transactionId}-${entry.transactionType}`)
      .map((entriesGroup: ILedgerEntry[], key: string) => {
        const headEntry = head(entriesGroup);
        return this.entriesGroupsMapper(entriesGroup, headEntry);
      })
      .value();
  }

  /**
   * Retrieve journal report.
   * @return {IJournalReport}
   */
  reportData(): IJournalTableData {
    return this.entriesWalker(this.repository.ledger.entries);
  }
}
