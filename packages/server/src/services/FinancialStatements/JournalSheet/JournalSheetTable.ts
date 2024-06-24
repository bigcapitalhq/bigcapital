import * as R from 'ramda';
import { first } from 'lodash';
import {
  IColumnMapperMeta,
  IJournalEntry,
  IJournalReportEntriesGroup,
  IJournalReportQuery,
  IJournalTableData,
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '@/interfaces';
import { tableRowMapper } from '@/utils';
import { FinancialTable } from '../FinancialTable';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import FinancialSheet from '../FinancialSheet';
import { ROW_TYPE } from './types';

export class JournalSheetTable extends R.compose(
  FinancialTable,
  FinancialSheetStructure
)(FinancialSheet) {
  private data: IJournalTableData;
  private query: IJournalReportQuery;
  private i18n: any;

  /**
   * Constructor method.
   * @param {IJournalTableData} data
   * @param {IJournalReportQuery} query
   * @param i18n
   */
  constructor(data: IJournalTableData, query: IJournalReportQuery, i18n: any) {
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
      { key: 'date', accessor: 'dateFormatted' },
      { key: 'transaction_type', accessor: 'referenceTypeFormatted' },
      { key: 'transaction_number', accessor: 'entry.transactionNumber' },
      { key: 'description', accessor: 'entry.note' },
      { key: 'account_code', accessor: 'entry.accountCode' },
      { key: 'account_name', accessor: 'entry.accountName' },
      { key: 'debit', accessor: 'entry.formattedDebit' },
      { key: 'credit', accessor: 'entry.formattedCredit' },
    ];
  };

  /**
   * Retrieves the group entry accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private entryColumnsAccessors = (): ITableColumnAccessor[] => {
    return [
      { key: 'date', accessor: '_empty_' },
      { key: 'transaction_type', accessor: '_empty_' },
      { key: 'transaction_number', accessor: 'transactionNumber' },
      { key: 'description', accessor: 'note' },
      { key: 'account_code', accessor: 'accountCode' },
      { key: 'account_name', accessor: 'accountName' },
      { key: 'debit', accessor: 'formattedDebit' },
      { key: 'credit', accessor: 'formattedCredit' },
    ];
  };

  /**
   * Retrieves the total entry column accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private totalEntryColumnAccessors = (): ITableColumnAccessor[] => {
    return [
      { key: 'date', accessor: '_empty_' },
      { key: 'transaction_type', accessor: '_empty_' },
      { key: 'transaction_number', accessor: '_empty_' },
      { key: 'description', accessor: '_empty_' },
      { key: 'account_code', accessor: '_empty_' },
      { key: 'account_name', accessor: '_empty_' },
      { key: 'debit', accessor: 'formattedDebit' },
      { key: 'credit', accessor: 'formattedCredit' },
    ];
  };

  /**
   * Retrieves the total entry column accessors.
   * @returns {IColumnMapperMeta[]}
   */
  private blankEnrtyColumnAccessors = (): IColumnMapperMeta[] => {
    return [
      { key: 'date', value: '' },
      { key: 'transaction_type', value: '' },
      { key: 'transaction_number', value: '' },
      { key: 'description', value: '' },
      { key: 'account_code', value: '' },
      { key: 'account_name', value: '' },
      { key: 'debit', value: '' },
      { key: 'credit', value: '' },
    ];
  };

  /**
   * Retrieves the common columns.
   * @returns {ITableColumn[]}
   */
  private commonColumns(): ITableColumn[] {
    return [
      { key: 'date', label: 'Date' },
      { key: 'transaction_type', label: 'Transaction Type' },
      { key: 'transaction_number', label: 'Num.' },
      { key: 'description', label: 'Description' },
      { key: 'account_code', label: 'Acc. Code' },
      { key: 'account_name', label: 'Account' },
      { key: 'debit', label: 'Debit' },
      { key: 'credit', label: 'Credit' },
    ];
  }

  /**
   * Maps the group and first entry to table row.
   * @param {IJournalReportEntriesGroup} group
   * @returns {ITableRow}
   */
  private firstEntryGroupMapper = (
    group: IJournalReportEntriesGroup
  ): ITableRow => {
    const meta = {
      rowTypes: [ROW_TYPE.ENTRY],
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
  private entryMapper = (entry: IJournalEntry): ITableRow => {
    const columns = this.entryColumnsAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.ENTRY],
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

    return R.map(this.entryMapper, entries);
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
    return tableRowMapper({} as IJournalEntry, columns, meta);
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
    entries: IJournalReportEntriesGroup[]
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
