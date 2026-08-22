import * as R from 'ramda';
import { first } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import {
  IJournalReportEntriesGroup,
  IJournalReportQuery,
  IJournalSheetEntry,
  IJournalTableData,
} from './JournalSheet.types';
import { ROW_TYPE } from './types';
import { FinancialTable } from '../../common/FinancialTable';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialSheet } from '../../common/FinancialSheet';
import {
  IColumnMapperMeta,
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '../../types/Table.types';
import { tableRowMapper } from '../../utils/Table.utils';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { JOURNAL_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export class JournalSheetTable extends R.pipe(
  FinancialTable,
  FinancialSheetStructure,
)(FinancialSheet) {
  data: IJournalTableData;
  query: IJournalReportQuery;
  i18n: any;

  /**
   * Constructor method.
   * @param {IJournalTableData} data -
   * @param {IJournalReportQuery} query -
   * @param {I18nService} i18n - I18n service.
   */
  constructor(
    data: IJournalTableData,
    query: IJournalReportQuery,
    i18n: I18nService,
  ) {
    super();

    this.data = data;
    this.query = query;
    this.i18n = i18n;
  }

  /**
   * Retrieves the common table accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private groupColumnsAccessors = (): ITableColumnAccessor[] => {
    return [
      { key: JOURNAL_COLUMN_KEYS.DATE, accessor: 'dateFormatted' },
      {
        key: JOURNAL_COLUMN_KEYS.TRANSACTION_TYPE,
        accessor: 'referenceTypeFormatted',
      },
      {
        key: JOURNAL_COLUMN_KEYS.TRANSACTION_NUMBER,
        accessor: 'entry.transactionNumber',
      },
      { key: JOURNAL_COLUMN_KEYS.DESCRIPTION, accessor: 'entry.note' },
      { key: JOURNAL_COLUMN_KEYS.ACCOUNT_CODE, accessor: 'entry.accountCode' },
      { key: JOURNAL_COLUMN_KEYS.ACCOUNT_NAME, accessor: 'entry.accountName' },
      { key: JOURNAL_COLUMN_KEYS.DEBIT, accessor: 'entry.formattedDebit' },
      { key: JOURNAL_COLUMN_KEYS.CREDIT, accessor: 'entry.formattedCredit' },
    ];
  };

  /**
   * Retrieves the group entry accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private entryColumnsAccessors = (): ITableColumnAccessor[] => {
    return [
      { key: JOURNAL_COLUMN_KEYS.DATE, accessor: '_empty_' },
      { key: JOURNAL_COLUMN_KEYS.TRANSACTION_TYPE, accessor: '_empty_' },
      {
        key: JOURNAL_COLUMN_KEYS.TRANSACTION_NUMBER,
        accessor: 'transactionNumber',
      },
      { key: JOURNAL_COLUMN_KEYS.DESCRIPTION, accessor: 'note' },
      { key: JOURNAL_COLUMN_KEYS.ACCOUNT_CODE, accessor: 'accountCode' },
      { key: JOURNAL_COLUMN_KEYS.ACCOUNT_NAME, accessor: 'accountName' },
      { key: JOURNAL_COLUMN_KEYS.DEBIT, accessor: 'formattedDebit' },
      { key: JOURNAL_COLUMN_KEYS.CREDIT, accessor: 'formattedCredit' },
    ];
  };

  /**
   * Retrieves the total entry column accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private totalEntryColumnAccessors = (): ITableColumnAccessor[] => {
    return [
      { key: JOURNAL_COLUMN_KEYS.DATE, accessor: '_empty_' },
      { key: JOURNAL_COLUMN_KEYS.TRANSACTION_TYPE, accessor: '_empty_' },
      { key: JOURNAL_COLUMN_KEYS.TRANSACTION_NUMBER, accessor: '_empty_' },
      { key: JOURNAL_COLUMN_KEYS.DESCRIPTION, accessor: '_empty_' },
      { key: JOURNAL_COLUMN_KEYS.ACCOUNT_CODE, accessor: '_empty_' },
      { key: JOURNAL_COLUMN_KEYS.ACCOUNT_NAME, accessor: '_empty_' },
      { key: JOURNAL_COLUMN_KEYS.DEBIT, accessor: 'formattedDebit' },
      { key: JOURNAL_COLUMN_KEYS.CREDIT, accessor: 'formattedCredit' },
    ];
  };

  /**
   * Retrieves the total entry column accessors.
   * @returns {IColumnMapperMeta[]}
   */
  private blankEnrtyColumnAccessors = (): IColumnMapperMeta[] => {
    return [
      { key: JOURNAL_COLUMN_KEYS.DATE, value: '' },
      { key: JOURNAL_COLUMN_KEYS.TRANSACTION_TYPE, value: '' },
      { key: JOURNAL_COLUMN_KEYS.TRANSACTION_NUMBER, value: '' },
      { key: JOURNAL_COLUMN_KEYS.DESCRIPTION, value: '' },
      { key: JOURNAL_COLUMN_KEYS.ACCOUNT_CODE, value: '' },
      { key: JOURNAL_COLUMN_KEYS.ACCOUNT_NAME, value: '' },
      { key: JOURNAL_COLUMN_KEYS.DEBIT, value: '' },
      { key: JOURNAL_COLUMN_KEYS.CREDIT, value: '' },
    ];
  };

  /**
   * Retrieves the common columns.
   * @returns {ITableColumn[]}
   */
  private commonColumns(): ITableColumn[] {
    return [
      { key: JOURNAL_COLUMN_KEYS.DATE, label: 'Date' },
      { key: JOURNAL_COLUMN_KEYS.TRANSACTION_TYPE, label: 'Transaction Type' },
      { key: JOURNAL_COLUMN_KEYS.TRANSACTION_NUMBER, label: 'Num.' },
      { key: JOURNAL_COLUMN_KEYS.DESCRIPTION, label: 'Description' },
      { key: JOURNAL_COLUMN_KEYS.ACCOUNT_CODE, label: 'Acc. Code' },
      { key: JOURNAL_COLUMN_KEYS.ACCOUNT_NAME, label: 'Account' },
      { key: JOURNAL_COLUMN_KEYS.DEBIT, label: 'Debit' },
      { key: JOURNAL_COLUMN_KEYS.CREDIT, label: 'Credit' },
    ];
  }

  /**
   * Maps the group and first entry to table row.
   * @param {IJournalReportEntriesGroup} group
   * @returns {ITableRow}
   */
  private firstEntryGroupMapper = (
    group: IJournalReportEntriesGroup,
  ): ITableRow => {
    const meta = {
      rowTypes: [ROW_TYPE.ENTRY],
      meta: {
        referenceType: group.transactionType,
        referenceId: group.referenceId,
      },
    };
    const computedGroup = { ...group, entry: first(group.entries) };
    const columns = this.groupColumnsAccessors();

    return tableRowMapper(computedGroup, columns, meta);
  };

  /**
   * Maps the given group entry to table rows.
   * @param {IJournalEntry} entry
   * @returns {ITableRow}
   */
  private entryMapper = (
    entry: IJournalSheetEntry,
    reference?: { referenceType?: string; referenceId?: number },
  ): ITableRow => {
    const columns = this.entryColumnsAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.ENTRY],
      ...(reference && {
        meta: {
          referenceType: reference.referenceType,
          referenceId: reference.referenceId,
        },
      }),
    };
    return tableRowMapper(entry, columns, meta);
  };

  /**
   * Maps the given group entries to table rows.
   * @param {IJournalReportEntriesGroup} group
   * @returns {ITableRow[]}
   */
  private entriesMapper = (group: IJournalReportEntriesGroup): ITableRow[] => {
    const entries = R.remove(0, 1, group.entries);
    const reference = {
      referenceType: group.transactionType,
      referenceId: group.referenceId,
    };
    return R.map((entry) => this.entryMapper(entry, reference), entries);
  };

  /**
   * Maps the given group entry to total table row.
   * @param {IJournalReportEntriesGroup} group
   * @returns {ITableRow}
   */
  public totalEntryMapper = (group: IJournalReportEntriesGroup): ITableRow => {
    const total = this.totalEntryColumnAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.TOTAL],
    };
    return tableRowMapper(group, total, meta);
  };

  /**
   * Retrieves the blank entry row.
   * @returns {ITableRow}
   */
  private blankEntryMapper = (): ITableRow => {
    const columns = this.blankEnrtyColumnAccessors();
    const meta = {};
    return tableRowMapper({} as ILedgerEntry, columns, meta);
  };

  /**
   * Maps the entry group to table rows.
   * @param {IJournalReportEntriesGroup} group -
   * @returns {ITableRow}
   */
  private groupMapper = (group: IJournalReportEntriesGroup): ITableRow[] => {
    const firstRow = this.firstEntryGroupMapper(group);
    const lastRows = this.entriesMapper(group);
    const totalRow = this.totalEntryMapper(group);
    const blankRow = this.blankEntryMapper();

    return [firstRow, ...lastRows, totalRow, blankRow];
  };

  /**
   * Maps the given group entries to table rows.
   * @param {IJournalReportEntriesGroup[]} entries -
   * @returns {ITableRow[]}
   */
  private groupsMapper = (
    entries: IJournalReportEntriesGroup[],
  ): ITableRow[] => {
    return R.compose(R.flatten, R.map(this.groupMapper))(entries);
  };

  /**
   * Retrieves the table data rows.
   * @returns {ITableRow[]}
   */
  public tableData(): ITableRow[] {
    return R.compose(this.groupsMapper)(this.data);
  }

  /**
   * Retrieves the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns(): ITableColumn[] {
    const columns = this.commonColumns();

    return R.compose(this.tableColumnsCellIndexing)(columns);
  }
}
