import * as R from 'ramda';
import {
  IJournalReport,
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

export class JournalSheetTable extends R.compose(
  FinancialTable,
  FinancialSheetStructure
)(FinancialSheet) {
  private data: IJournalTableData;
  private query: IJournalReportQuery;
  private i18n: any;

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
  private commonColumnsAccessors = (): ITableColumnAccessor[] => {
    return [
      { key: 'date', accessor: 'date' },
      { key: 'reference_type', accessor: 'referenceTypeFormatted' },
      { key: 'reference_number', accessor: 'reference_number' },
      { key: 'currency_code', accessor: 'currencyCode' },
      { key: 'credit', accessor: 'formattedCredit' },
      { key: 'debit', accessor: 'formattedDebit' },
    ];
  };

  private commonColumns(): ITableColumn[] {
    return [
      { key: 'date', label: 'Date' },
      { key: 'reference_type', label: 'Reference Type' },
      { key: 'reference_type', label: 'Reference Number' },
      { key: 'currency_code', label: 'Currency Code' },
      { key: 'credit', label: 'Credit' },
      { key: 'debit', label: 'Debit' },
    ];
  }

  /**
   *
   */
  private entryGroupMapper = (group: IJournalReportEntriesGroup) => {
    const columns = this.commonColumnsAccessors();

    return tableRowMapper(group, columns, {});
  };

  /**
   *
   */
  private entryMapper = () => {};

  /**
   *
   */
  private entriesGroupsMapper = (entries: IJournalReportEntriesGroup[]) => {
    return R.compose(R.map(this.entryGroupMapper))(entries);
  };

  /**
   * Retrieves the table data rows.
   * @returns {ITableRow[]}
   */
  public tableData(): ITableRow[] {
    return R.compose(this.entriesGroupsMapper)(this.data);
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
