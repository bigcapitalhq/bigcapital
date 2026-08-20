import * as R from 'ramda';
import {
  IGeneralLedgerMeta,
  IGeneralLedgerSheetAccount,
  IGeneralLedgerSheetAccountTransaction,
  IGeneralLedgerSheetData,
  IGeneralLedgerSheetQuery,
} from './GeneralLedger.types';
import { FinancialSheet } from '../../common/FinancialSheet';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialTable } from '../../common/FinancialTable';
import { ROW_TYPE } from './utils';
import {
  IColumnMapperMeta,
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '../../types/Table.types';
import { tableRowMapper } from '../../utils/Table.utils';
import { GENERAL_LEDGER_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export class GeneralLedgerTable extends R.compose(
  FinancialTable,
  FinancialSheetStructure,
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
    meta: IGeneralLedgerMeta,
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
      { key: GENERAL_LEDGER_COLUMN_KEYS.DATE, accessor: 'name' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.ACCOUNT_NAME, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_TYPE, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_NUMBER, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DESCRIPTION, accessor: 'description' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.CREDIT, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DEBIT, accessor: '_empty_' },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.AMOUNT,
        accessor: 'amount.formattedAmount',
      },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.RUNNING_BALANCE,
        accessor: 'closingBalance.formattedAmount',
      },
    ];
  }

  /**
   * Retrieves the transaction column accessors.
   * @returns {ITableColumnAccessor[]}
   */
  private transactionColumnAccessors(): ITableColumnAccessor[] {
    return [
      { key: GENERAL_LEDGER_COLUMN_KEYS.DATE, accessor: 'dateFormatted' },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.ACCOUNT_NAME,
        accessor: 'account.name',
      },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_TYPE,
        accessor: 'transactionTypeFormatted',
      },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_NUMBER,
        accessor: 'transactionNumber',
      },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DESCRIPTION, accessor: 'note' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.CREDIT, accessor: 'formattedCredit' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DEBIT, accessor: 'formattedDebit' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.AMOUNT, accessor: 'formattedAmount' },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.RUNNING_BALANCE,
        accessor: 'formattedRunningBalance',
      },
    ];
  }

  /**
   * Retrieves the opening row column accessors.
   * @returns {ITableRowIColumnMapperMeta[]}
   */
  private openingBalanceColumnsAccessors(): IColumnMapperMeta[] {
    return [
      { key: GENERAL_LEDGER_COLUMN_KEYS.DATE, value: 'Opening Balance' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.ACCOUNT_NAME, value: '' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_TYPE, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_NUMBER, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DESCRIPTION, accessor: 'description' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.CREDIT, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DEBIT, accessor: '_empty_' },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.AMOUNT,
        accessor: 'openingBalance.formattedAmount',
      },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.RUNNING_BALANCE,
        accessor: 'openingBalance.formattedAmount',
      },
    ];
  }

  /**
   * Closing balance row column accessors.
   * @param {IGeneralLedgerSheetAccount} account -
   * @returns {ITableColumnAccessor[]}
   */
  private closingBalanceColumnAccessors(
    account: IGeneralLedgerSheetAccount,
  ): IColumnMapperMeta[] {
    return [
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.DATE,
        value: `Closing balance for ${account.name}`,
      },
      { key: GENERAL_LEDGER_COLUMN_KEYS.ACCOUNT_NAME, value: `` },
      { key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_TYPE, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_NUMBER, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DESCRIPTION, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.CREDIT, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DEBIT, accessor: '_empty_' },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.AMOUNT,
        accessor: 'closingBalance.formattedAmount',
      },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.RUNNING_BALANCE,
        accessor: 'closingBalance.formattedAmount',
      },
    ];
  }

  /**
   * Closing balance row column accessors.
   * @param {IGeneralLedgerSheetAccount} account -
   * @returns {ITableColumnAccessor[]}
   */
  private closingBalanceWithSubaccountsColumnAccessors(
    account: IGeneralLedgerSheetAccount,
  ): IColumnMapperMeta[] {
    return [
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.DATE,
        value: `Closing Balance for ${account.name} with sub-accounts`,
      },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.ACCOUNT_NAME,
        value: ``,
      },
      { key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_TYPE, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_NUMBER, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DESCRIPTION, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.CREDIT, accessor: '_empty_' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DEBIT, accessor: '_empty_' },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.AMOUNT,
        accessor: 'closingBalanceSubaccounts.formattedAmount',
      },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.RUNNING_BALANCE,
        accessor: 'closingBalanceSubaccounts.formattedAmount',
      },
    ];
  }

  /**
   * Retrieves the common table columns.
   * @returns {ITableColumn[]}
   */
  private commonColumns(): ITableColumn[] {
    return [
      { key: GENERAL_LEDGER_COLUMN_KEYS.DATE, label: 'Date' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.ACCOUNT_NAME, label: 'Account Name' },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_TYPE,
        label: 'Transaction Type',
      },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.REFERENCE_NUMBER,
        label: 'Transaction #',
      },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DESCRIPTION, label: 'Description' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.CREDIT, label: 'Credit' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.DEBIT, label: 'Debit' },
      { key: GENERAL_LEDGER_COLUMN_KEYS.AMOUNT, label: 'Amount' },
      {
        key: GENERAL_LEDGER_COLUMN_KEYS.RUNNING_BALANCE,
        label: 'Running Balance',
      },
    ];
  }

  /**
   * Maps the given transaction node to table row.
   * @param {IGeneralLedgerSheetAccount} account - Account.
   * @param {IGeneralLedgerSheetAccountTransaction} transaction - Transaction.
   * @returns {ITableRow}
   */
  private transactionMapper = R.curry(
    (
      account: IGeneralLedgerSheetAccount,
      transaction: IGeneralLedgerSheetAccountTransaction,
    ): ITableRow => {
      const columns = this.transactionColumnAccessors();
      const data = { ...transaction, account };
      const meta = {
        rowTypes: [ROW_TYPE.TRANSACTION],
        meta: {
          referenceType: transaction.referenceType,
          referenceId: transaction.referenceId,
        },
      };
      return tableRowMapper(data, columns, meta);
    },
  );

  /**
   * Maps the given transactions nodes to table rows.
   * @param {IGeneralLedgerSheetAccountTransaction[]} transactions
   * @returns {ITableRow[]}
   */
  private transactionsMapper = (
    account: IGeneralLedgerSheetAccount,
  ): ITableRow[] => {
    const transactionMapper = this.transactionMapper(account);

    // @ts-ignore
    return R.map(transactionMapper)(account.transactions);
  };

  /**
   * Maps the given account node to opening balance table row.
   * @param {IGeneralLedgerSheetAccount} account
   * @returns {ITableRow}
   */
  private openingBalanceMapper = (
    account: IGeneralLedgerSheetAccount,
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
    const columns = this.closingBalanceColumnAccessors(account);
    const meta = {
      rowTypes: [ROW_TYPE.CLOSING_BALANCE],
    };
    return tableRowMapper(account, columns, meta);
  };

  /**
   * Maps the given account node to opening balance table row.
   * @param {IGeneralLedgerSheetAccount} account
   * @returns {ITableRow}
   */
  private closingBalanceWithSubaccountsMapper = (
    account: IGeneralLedgerSheetAccount,
  ): ITableRow => {
    const columns = this.closingBalanceWithSubaccountsColumnAccessors(account);
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
    account: IGeneralLedgerSheetAccount,
  ): ITableRow[] => {
    const openingBalance = this.openingBalanceMapper(account);
    const transactions = this.transactionsMapper(account);
    const closingBalance = this.closingBalanceMapper(account);

    return R.when(
      R.always(R.not(R.isEmpty(transactions))),
      R.prepend(openingBalance),
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
    const closingBalanceWithSubaccounts =
      this.closingBalanceWithSubaccountsMapper(account);

    // Appends the closing balance with sub-accounts row if the account
    // has children accounts and the node is define.
    const isAppendClosingSubaccounts = () =>
      account.children?.length > 0 && !!account.closingBalanceSubaccounts;

    // @ts-ignore
    const children = R.compose(
      R.when(
        isAppendClosingSubaccounts,
        R.append(closingBalanceWithSubaccounts),
      ),
      R.concat(R.defaultTo([], transactions)),
      R.when(
        () => account?.children?.length > 0,
        R.concat(R.defaultTo([], account.children)),
      ),
    )([]);

    return R.assoc('children', children)(row);
  };

  /**
   * Maps the given account node to table rows.
   * @param {IGeneralLedgerSheetAccount[]} accounts
   * @returns {ITableRow[]}
   */
  private accountsMapper = (
    accounts: IGeneralLedgerSheetAccount[],
  ): ITableRow[] => {
    return this.mapNodesDeepReverse(accounts, this.accountMapper);
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
