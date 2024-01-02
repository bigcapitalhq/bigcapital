import * as R from 'ramda';
import {
  IGeneralLedgerSheetAccount,
  IGeneralLedgerSheetData,
  IGeneralLedgerSheetQuery,
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '@/interfaces';
import FinancialSheet from '../FinancialSheet';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import { FinancialTable } from '../FinancialTable';
import { tableRowMapper } from '@/utils';

export class GeneralLedgerTable extends R.compose(
  FinancialTable,
  FinancialSheetStructure
)(FinancialSheet) {
  private data: IGeneralLedgerSheetData;
  private query: IGeneralLedgerSheetQuery;

  /**
   * Creates an instance of `GeneralLedgerTable`.
   * @param {IGeneralLedgerSheetData} data
   * @param {IGeneralLedgerSheetQuery} query
   */
  constructor(data: IGeneralLedgerSheetData, query: IGeneralLedgerSheetQuery) {
    super();

    this.data = data;
    this.query = query;
  }

  /**
   * Retrieves the common table accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private commonColumnsAccessors(): ITableColumnAccessor[] {
    return [
      { key: 'date', accessor: 'date' },
      { key: 'reference_type', accessor: 'referenceTypeFormatted' },
      { key: 'reference_number', accessor: 'reference_number' },
      { key: 'currency_code', accessor: 'currencyCode' },
      { key: 'credit', accessor: 'formattedCredit' },
      { key: 'debit', accessor: 'formattedDebit' },
      { key: 'running_balance', accessor: 'formattedRunningBalance' },
    ];
  }

  /**
   * Retrieves the common table columns.
   * @returns {ITableColumn[]}
   */
  private commonColumns(): ITableColumn[] {
    return [
      { key: 'date', label: 'Date' },
      { key: 'reference_type', label: 'Reference Type' },
      { key: 'reference_number', label: 'Reference Number' },
      { key: 'currency_code', label: 'Currency Code' },
      { key: 'credit', label: 'Credit' },
      { key: 'debit', label: 'Debit' },
      { key: 'running_balance', label: 'Running Balance' },
    ];
  }

  /**
   * Maps the given account node to the table rows.
   * @param {IGeneralLedgerSheetAccount} account
   * @returns {ITableRow}
   */
  private accountMapper = (account: IGeneralLedgerSheetAccount): ITableRow => {
    const columns = this.commonColumnsAccessors();

    return tableRowMapper(account, columns, {});
  };

  /**
   * Maps the given account node to table rows.
   * @param {IGeneralLedgerSheetAccount[]} accounts
   * @returns {ITableRow[]}
   */
  private accountsMapper = (
    accounts: IGeneralLedgerSheetAccount[]
  ): ITableRow[] => {
    return R.compose(R.map(this.accountMapper))(accounts);
  };

  /**
   * Retrieves the table rows.
   * @returns {ITableRow[]}
   */
  public tableRows(): ITableRow[] {
    return R.compose(this.accountsMapper)(this.data);
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
