import * as R from 'ramda';
import FinancialSheet from '../FinancialSheet';
import { FinancialTable } from '../FinancialTable';
import {
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
  ITrialBalanceAccount,
  ITrialBalanceSheetData,
  ITrialBalanceSheetQuery,
  ITrialBalanceTotal,
} from '@/interfaces';
import { tableRowMapper } from '@/utils';
import { IROW_TYPE } from '../BalanceSheet/constants';
import { FinancialSheetStructure } from '../FinancialSheetStructure';

export class TrialBalanceSheetTable extends R.compose(
  FinancialTable,
  FinancialSheetStructure
)(FinancialSheet) {
  /**
   * Trial balance sheet data.
   * @param {ITrialBalanceSheetData}
   */
  public data: ITrialBalanceSheetData;

  /**
   * Trial balance sheet query.
   * @param {ITrialBalanceSheetQuery}
   */
  public query: ITrialBalanceSheetQuery;

  /**
   * Constructor method.
   * @param {IBalanceSheetStatementData} reportData -
   * @param {ITrialBalanceSheetQuery} query -
   */
  constructor(
    data: ITrialBalanceSheetData,
    query: ITrialBalanceSheetQuery,
    i18n: any
  ) {
    super();

    this.data = data;
    this.query = query;
    this.i18n = i18n;
  }

  /**
   * Retrieve the common columns for all report nodes.
   * @param {ITableColumnAccessor[]}
   */
  private commonColumnsAccessors = (): ITableColumnAccessor[] => {
    return [
      { key: 'account', accessor: 'formattedName' },
      { key: 'debit', accessor: 'formattedDebit' },
      { key: 'credit', accessor: 'formattedCredit' },
      { key: 'total', accessor: 'formattedBalance' },
    ];
  };

  /**
   * Maps the account node to table row.
   * @param {ITrialBalanceAccount} node -
   * @returns {ITableRow}
   */
  private accountNodeTableRowsMapper = (
    node: ITrialBalanceAccount
  ): ITableRow => {
    const columns = this.commonColumnsAccessors();
    const meta = {
      rowTypes: [IROW_TYPE.ACCOUNT],
      id: node.id,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Maps the total node to table row.
   * @param {ITrialBalanceTotal} node -
   * @returns {ITableRow}
   */
  private totalNodeTableRowsMapper = (node: ITrialBalanceTotal): ITableRow => {
    const columns = this.commonColumnsAccessors();
    const meta = {
      rowTypes: [IROW_TYPE.TOTAL],
      id: node.id,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Mappes the given report sections to table rows.
   * @param  {IBalanceSheetDataNode[]} nodes -
   * @return {ITableRow}
   */
  private accountsToTableRowsMap = (
    nodes: ITrialBalanceAccount[]
  ): ITableRow[] => {
    return this.mapNodesDeep(nodes, this.accountNodeTableRowsMapper);
  };

  /**
   * Retrieves the accounts table rows of the given report data.
   * @returns {ITableRow[]}
   */
  private accountsTableRows = (): ITableRow[] => {
    return this.accountsToTableRowsMap(this.data.accounts);
  };

  /**
   * Maps the given total node to table row.
   * @returns {ITableRow}
   */
  private totalTableRow = (): ITableRow => {
    return this.totalNodeTableRowsMapper(this.data.total);
  };

  /**
   * Retrieves the table rows.
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    return R.compose(
      R.unless(R.isEmpty, R.append(this.totalTableRow())),
      R.concat(this.accountsTableRows())
    )([]);
  };

  /**
   * Retrrieves the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns = (): ITableColumn[] => {
    return R.compose(
      this.tableColumnsCellIndexing,
      R.concat([
        { key: 'account', label: 'Account' },
        { key: 'debit', label: 'Debit' },
        { key: 'credit', label: 'Credit' },
        { key: 'total', label: 'Total' },
      ])
    )([]);
  };
}
