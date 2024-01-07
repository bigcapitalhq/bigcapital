import * as R from 'ramda';
import {
  IColumnMapperMeta,
  IGeneralLedgerMeta,
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
import { ROW_TYPE } from './utils';

export class GeneralLedgerTable extends R.compose(
  FinancialTable,
  FinancialSheetStructure
)(FinancialSheet) {
  private data: IGeneralLedgerSheetData;
  private query: IGeneralLedgerSheetQuery;
  private meta: IGeneralLedgerMeta;

  /**
   * Creates an instance of `GeneralLedgerTable`.
   * @param {IGeneralLedgerSheetData} data
   * @param {IGeneralLedgerSheetQuery} query
   */
  constructor(
    data: IGeneralLedgerSheetData,
    query: IGeneralLedgerSheetQuery,
    meta: IGeneralLedgerMeta
  ) {
    super();

    this.data = data;
    this.query = query;
    this.meta = meta;
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
      { key: 'running_balance', accessor: 'closingBalance.formattedAmount' },
    ];
  }

  /**
   * Retrieves the transaction column accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private transactionColumnAccessors(): ITableColumnAccessor[] {
    return [
      { key: 'date', accessor: 'dateFormatted' },
      { key: 'account_name', accessor: 'account.name' },
      { key: 'reference_type', accessor: 'referenceTypeFormatted' },
      { key: 'reference_number', accessor: 'transactionNumber' },
      { key: 'description', accessor: 'note' },
      { key: 'credit', accessor: 'formattedCredit' },
      { key: 'debit', accessor: 'formattedDebit' },
      { key: 'amount', accessor: 'formattedAmount' },
      { key: 'running_balance', accessor: 'formattedRunningBalance' },
    ];
  }

  /**
   * Retrieves the opening row column accessors.
   * @returns {ITableRowIColumnMapperMeta[]}
   */
  private openingBalanceColumnsAccessors(): IColumnMapperMeta[] {
    return [
      { key: 'date', value: this.meta.fromDate },
      { key: 'account_name', value: 'Opening Balance' },
      { key: 'reference_type', accessor: '_empty_' },
      { key: 'reference_number', accessor: '_empty_' },
      { key: 'description', accessor: 'description' },
      { key: 'credit', accessor: '_empty_' },
      { key: 'debit', accessor: '_empty_' },
      { key: 'amount', accessor: 'openingBalance.formattedAmount' },
      { key: 'running_balance', accessor: 'openingBalance.formattedAmount' },
    ];
  }

  /**
   * Closing balance row column accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private closingBalanceColumnAccessors(): IColumnMapperMeta[] {
    return [
      { key: 'date', value: this.meta.toDate },
      { key: 'account_name', value: 'Closing Balance' },
      { key: 'reference_type', accessor: '_empty_' },
      { key: 'reference_number', accessor: '_empty_' },
      { key: 'description', accessor: '_empty_' },
      { key: 'credit', accessor: '_empty_' },
      { key: 'debit', accessor: '_empty_' },
      { key: 'amount', accessor: 'closingBalance.formattedAmount' },
      { key: 'running_balance', accessor: 'closingBalance.formattedAmount' },
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
      { key: 'reference_number', label: 'Transaction #' },
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
  private transactionMapper = R.curry(
    (
      account: IGeneralLedgerSheetAccount,
      transaction: IGeneralLedgerSheetAccountTransaction
    ): ITableRow => {
      const columns = this.transactionColumnAccessors();
      const data = { ...transaction, account };
      const meta = {
        rowTypes: [ROW_TYPE.TRANSACTION],
      };
      return tableRowMapper(data, columns, meta);
    }
  );

  /**
   * Maps the given transactions nodes to table rows.
   * @param {IGeneralLedgerSheetAccountTransaction[]} transactions
   * @returns {ITableRow[]}
   */
  private transactionsMapper = (
    account: IGeneralLedgerSheetAccount
  ): ITableRow[] => {
    const transactionMapper = this.transactionMapper(account);

    return R.map(transactionMapper)(account.transactions);
  };

  /**
   * Maps the given account node to opening balance table row.
   * @param {IGeneralLedgerSheetAccount} account
   * @returns {ITableRow}
   */
  private openingBalanceMapper = (
    account: IGeneralLedgerSheetAccount
  ): ITableRow => {
    const columns = this.openingBalanceColumnsAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.OPENING_BALANCE],
    };
    return tableRowMapper(account, columns, meta);
  };

  /**
   * Maps the given account node to closing balance table row.
   * @param {IGeneralLedgerSheetAccount} account
   * @returns {ITableRow}
   */
  private closingBalanceMapper = (account: IGeneralLedgerSheetAccount) => {
    const columns = this.closingBalanceColumnAccessors();
    const meta = {
      rowTypes: [ROW_TYPE.CLOSING_BALANCE],
    };
    return tableRowMapper(account, columns, meta);
  };

  /**
   * Maps the given account node to transactions table rows.
   * @param {IGeneralLedgerSheetAccount} account
   * @returns {ITableRow[]}
   */
  private transactionsNode = (
    account: IGeneralLedgerSheetAccount
  ): ITableRow[] => {
    const openingBalance = this.openingBalanceMapper(account);
    const transactions = this.transactionsMapper(account);
    const closingBalance = this.closingBalanceMapper(account);

    return R.when(
      R.always(R.not(R.isEmpty(transactions))),
      R.prepend(openingBalance)
    )([...transactions, closingBalance]) as ITableRow[];
  };

  /**
   * Maps the given account node to the table rows.
   * @param {IGeneralLedgerSheetAccount} account
   * @returns {ITableRow}
   */
  private accountMapper = (account: IGeneralLedgerSheetAccount): ITableRow => {
    const columns = this.accountColumnsAccessors();
    const transactions = this.transactionsNode(account);
    const meta = {
      rowTypes: [ROW_TYPE.ACCOUNT],
    };
    const row = tableRowMapper(account, columns, meta);

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
    return this.mapNodesDeep(accounts, this.accountMapper);
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
