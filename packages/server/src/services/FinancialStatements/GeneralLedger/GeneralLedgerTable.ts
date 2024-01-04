import * as R from 'ramda';
import {
  IGeneralLedgerSheetAccount,
  IGeneralLedgerSheetAccountTransaction,
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
  private accountColumnsAccessors(): ITableColumnAccessor[] {
    return [
      { key: 'date', accessor: 'name' },
      { key: 'account_name', accessor: '_empty_' },
      { key: 'reference_type', accessor: '_empty_' },
      { key: 'reference_number', accessor: '_empty_' },
      { key: 'description', accessor: 'description' },
      { key: 'credit', accessor: '_empty_' },
      { key: 'debit', accessor: '_empty_' },
      { key: 'amount', accessor: 'amount.formattedAmount' },
      { key: 'running_balance', accessor: 'openingBalance.formattedAmount' },
    ];
  }

  /**
   * Retrieves the transaction column accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private transactionColumnAccessors(): ITableColumnAccessor[] {
    return [
      { key: 'date', accessor: 'date' },
      { key: 'account_name', accessor: 'name' },
      { key: 'reference_type', accessor: 'referenceTypeFormatted' },
      { key: 'reference_number', accessor: 'referenceNumber' },
      { key: 'currency_code', accessor: 'currencyCode' },
      { key: 'credit', accessor: 'formattedCredit' },
      { key: 'debit', accessor: 'formattedDebit' },
      { key: 'running_balance', accessor: 'runningBalance.formattedAmount' },
    ];
  }

  /**
   * Retrieves the common table columns.
   * @returns {ITableColumn[]}
   */
  private commonColumns(): ITableColumn[] {
    return [
      { key: 'date', label: 'Date' },
      { key: 'account_name', label: 'Account Name' },
      { key: 'reference_type', label: 'Transaction Type' },
      { key: 'reference_number', label: 'Transaction Number' },
      { key: 'description', label: 'Description' },
      { key: 'credit', label: 'Credit' },
      { key: 'debit', label: 'Debit' },
      { key: 'amount', label: 'Amount' },
      { key: 'running_balance', label: 'Running Balance' },
    ];
  }

  /**
   * Maps the given transaction node to table row.
   * @param {IGeneralLedgerSheetAccountTransaction} transaction
   * @returns {ITableRow}
   */
  private transactionMapper = (
    transaction: IGeneralLedgerSheetAccountTransaction
  ): ITableRow => {
    const columns = this.transactionColumnAccessors();

    return tableRowMapper(transaction, columns, {});
  };

  /**
   * Maps the given transactions nodes to table rows.
   * @param {IGeneralLedgerSheetAccountTransaction[]} transactions
   * @returns {ITableRow[]}
   */
  private transactionsMapper = (
    transactions: IGeneralLedgerSheetAccountTransaction[]
  ): ITableRow[] => {
    return R.map(this.transactionMapper)(transactions);
  };

  /**
   * Maps the given account node to the table rows.
   * @param {IGeneralLedgerSheetAccount} account
   * @returns {ITableRow}
   */
  private accountMapper = (account: IGeneralLedgerSheetAccount): ITableRow => {
    const columns = this.accountColumnsAccessors();
    const row = tableRowMapper(account, columns, {});
    const transactions = this.transactionsMapper(account.transactions);

    return R.assoc('children', transactions)(row);
  };

  /**
   * Maps the given account node to table rows.
   * @param {IGeneralLedgerSheetAccount[]} accounts
   * @returns {ITableRow[]}
   */
  private accountsMapper = (
    accounts: IGeneralLedgerSheetAccount[]
  ): ITableRow[] => {
    return this.mapNodesDeep(accounts, this.accountMapper)l
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
