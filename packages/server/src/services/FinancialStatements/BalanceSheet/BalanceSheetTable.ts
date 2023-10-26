import * as R from 'ramda';
import {
  IBalanceSheetStatementData,
  ITableColumnAccessor,
  IBalanceSheetQuery,
  ITableColumn,
  ITableRow,
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetDataNode,
  IBalanceSheetSchemaNode,
  IBalanceSheetNetIncomeNode,
  IBalanceSheetAccountNode,
  IBalanceSheetAccountsNode,
  IBalanceSheetAggregateNode,
} from '@/interfaces';
import { tableRowMapper } from 'utils';
import FinancialSheet from '../FinancialSheet';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { IROW_TYPE, DISPLAY_COLUMNS_BY } from './constants';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { BalanceSheetPercentage } from './BalanceSheetPercentage';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import { BalanceSheetBase } from './BalanceSheetBase';
import { BalanceSheetTablePercentage } from './BalanceSheetTablePercentage';
import { BalanceSheetTablePreviousYear } from './BalanceSheetTablePreviousYear';
import { BalanceSheetTablePreviousPeriod } from './BalanceSheetTablePreviousPeriod';
import { FinancialTable } from '../FinancialTable';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetTableDatePeriods } from './BalanceSheetTableDatePeriods';

export default class BalanceSheetTable extends R.compose(
  BalanceSheetTablePreviousPeriod,
  BalanceSheetTablePreviousYear,
  BalanceSheetTableDatePeriods,
  BalanceSheetTablePercentage,
  BalanceSheetComparsionPreviousYear,
  BalanceSheetComparsionPreviousPeriod,
  BalanceSheetPercentage,
  FinancialSheetStructure,
  FinancialTable,
  BalanceSheetBase
)(FinancialSheet) {
  /**
   * @param {}
   */
  reportData: IBalanceSheetStatementData;

  /**
   * Balance sheet query.
   * @parma {}
   */
  query: BalanceSheetQuery;

  /**
   * Constructor method.
   * @param {IBalanceSheetStatementData} reportData -
   * @param {IBalanceSheetQuery} query -
   */
  constructor(
    reportData: IBalanceSheetStatementData,
    query: IBalanceSheetQuery,
    i18n: any
  ) {
    super();

    this.reportData = reportData;
    this.query = new BalanceSheetQuery(query);
    this.i18n = i18n;
  }

  /**
   * Detarmines the node type of the given schema node.
   * @param  {IBalanceSheetStructureSection} node -
   * @param  {string} type -
   * @return {boolean}
   */
  protected isNodeType = R.curry(
    (type: string, node: IBalanceSheetSchemaNode): boolean => {
      return node.nodeType === type;
    }
  );

  // -------------------------
  // # Accessors.
  // -------------------------
  /**
   * Retrieve the common columns for all report nodes.
   * @param {ITableColumnAccessor[]}
   */
  private commonColumnsAccessors = (): ITableColumnAccessor[] => {
    return R.compose(
      R.concat([{ key: 'name', accessor: 'name' }]),
      R.ifElse(
        R.always(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        R.concat(this.datePeriodsColumnsAccessors()),
        R.concat(this.totalColumnAccessor())
      )
    )([]);
  };

  /**
   * Retrieve the total column accessor.
   * @return {ITableColumnAccessor[]}
   */
  private totalColumnAccessor = (): ITableColumnAccessor[] => {
    return R.pipe(
      R.concat(this.previousPeriodColumnAccessor()),
      R.concat(this.previousYearColumnAccessor()),
      R.concat(this.percentageColumnsAccessor()),
      R.concat([{ key: 'total', accessor: 'total.formattedAmount' }])
    )([]);
  };

  /**
   * Retrieves the table row from the given report aggregate node.
   * @param {IBalanceSheetAggregateNode} node
   * @returns {ITableRow}
   */
  private aggregateNodeTableRowsMapper = (
    node: IBalanceSheetAggregateNode
  ): ITableRow => {
    const columns = this.commonColumnsAccessors();
    const meta = {
      rowTypes: [IROW_TYPE.AGGREGATE],
      id: node.id,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Retrieves the table row from the given report accounts node.
   * @param {IBalanceSheetAccountsNode} node
   * @returns {ITableRow}
   */
  private accountsNodeTableRowsMapper = (
    node: IBalanceSheetAccountsNode
  ): ITableRow => {
    const columns = this.commonColumnsAccessors();
    const meta = {
      rowTypes: [IROW_TYPE.ACCOUNTS],
      id: node.id,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Retrieves the table row from the given report account node.
   * @param {IBalanceSheetAccountNode} node
   * @returns {ITableRow}
   */
  private accountNodeTableRowsMapper = (
    node: IBalanceSheetAccountNode
  ): ITableRow => {
    const columns = this.commonColumnsAccessors();

    const meta = {
      rowTypes: [IROW_TYPE.ACCOUNT],
      id: node.id,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Retrieves the table row from the given report net income node.
   * @param {IBalanceSheetNetIncomeNode} node
   * @returns {ITableRow}
   */
  private netIncomeNodeTableRowsMapper = (
    node: IBalanceSheetNetIncomeNode
  ): ITableRow => {
    const columns = this.commonColumnsAccessors();
    const meta = {
      rowTypes: [IROW_TYPE.NET_INCOME],
      id: node.id,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Mappes the given report node to table rows.
   * @param   {IBalanceSheetDataNode} node -
   * @returns {ITableRow}
   */
  private nodeToTableRowsMapper = (node: IBalanceSheetDataNode): ITableRow => {
    return R.cond([
      [
        this.isNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE),
        this.aggregateNodeTableRowsMapper,
      ],
      [
        this.isNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS),
        this.accountsNodeTableRowsMapper,
      ],
      [
        this.isNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNT),
        this.accountNodeTableRowsMapper,
      ],
      [
        this.isNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.NET_INCOME),
        this.netIncomeNodeTableRowsMapper,
      ],
    ])(node);
  };

  /**
   * Mappes the given report sections to table rows.
   * @param  {IBalanceSheetDataNode[]} nodes -
   * @return {ITableRow}
   */
  private nodesToTableRowsMapper = (
    nodes: IBalanceSheetDataNode[]
  ): ITableRow[] => {
    return this.mapNodesDeep(nodes, this.nodeToTableRowsMapper);
  };

  /**
   * Retrieves the total children columns.
   * @returns {ITableColumn[]}
   */
  private totalColumnChildren = (): ITableColumn[] => {
    return R.compose(
      R.unless(
        R.isEmpty,
        R.concat([{ key: 'total', Label: this.i18n.__('balance_sheet.total') }])
      ),
      R.concat(this.percentageColumns()),
      R.concat(this.getPreviousYearColumns()),
      R.concat(this.previousPeriodColumns())
    )([]);
  };

  /**
   * Retrieve the total column.
   * @returns {ITableColumn[]}
   */
  private totalColumn = (): ITableColumn[] => {
    return [
      {
        key: 'total',
        label: this.i18n.__('balance_sheet.total'),
        children: this.totalColumnChildren(),
      },
    ];
  };

  /**
   * Retrieve the report table rows.
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    return R.compose(
      this.addTotalRows,
      this.nodesToTableRowsMapper
    )(this.reportData);
  };

  // -------------------------
  // # Columns.
  // -------------------------
  /**
   * Retrieve the report table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns = (): ITableColumn[] => {
    return R.compose(
      this.tableColumnsCellIndexing,
      R.concat([
        { key: 'name', label: this.i18n.__('balance_sheet.account_name') },
      ]),
      R.ifElse(
        this.query.isDatePeriodsColumnsType,
        R.concat(this.datePeriodsColumns()),
        R.concat(this.totalColumn())
      )
    )([]);
  };
}
