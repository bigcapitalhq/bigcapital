import * as R from 'ramda';
import {
  IProfitLossSheetQuery,
  ITableColumn,
  IProfitLossSheetAccountsNode,
  ITableColumnAccessor,
  ITableRow,
  ProfitLossNodeType,
  ProfitLossSheetRowType,
  IProfitLossSheetNode,
  IProfitLossSheetEquationNode,
  IProfitLossSheetAccountNode,
} from '@/interfaces';
import { tableRowMapper } from 'utils';
import { FinancialTable } from '../FinancialTable';
import { ProfitLossSheetBase } from './ProfitLossSheetBase';
import { ProfitLossSheetTablePercentage } from './ProfitLossSheetTablePercentage';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { ProfitLossTablePreviousPeriod } from './ProfitLossTablePreviousPeriod';
import { ProfitLossTablePreviousYear } from './ProfitLossTablePreviousYear';
import { FinancialSheetStructure } from '../FinancialSheetStructure';
import { ProfitLossSheetTableDatePeriods } from './ProfitLossSheetTableDatePeriods';

export class ProfitLossSheetTable extends R.compose(
  ProfitLossTablePreviousPeriod,
  ProfitLossTablePreviousYear,
  ProfitLossSheetTablePercentage,
  ProfitLossSheetTableDatePeriods,
  ProfitLossSheetBase,
  FinancialSheetStructure,
  FinancialTable
)(class {}) {
  readonly query: ProfitLossSheetQuery;

  /**
   * Constructor method.
   * @param {} date
   * @param {IProfitLossSheetQuery} query
   */
  constructor(data: any, query: IProfitLossSheetQuery, i18n: any) {
    super();

    this.query = new ProfitLossSheetQuery(query);
    this.reportData = data;
    this.i18n = i18n;
  }

  // ----------------------------------
  // # Rows
  // ----------------------------------
  /**
   * Retrieve the total column accessor.
   * @return {ITableColumnAccessor[]}
   */
  private totalColumnAccessor = (): ITableColumnAccessor[] => {
    return R.pipe(
      R.when(
        this.query.isPreviousPeriodActive,
        R.concat(this.previousPeriodColumnAccessor())
      ),
      R.when(
        this.query.isPreviousYearActive,
        R.concat(this.previousYearColumnAccessor())
      ),
      R.concat(this.percentageColumnsAccessor()),
      R.concat([{ key: 'total', accessor: 'total.formattedAmount' }])
    )([]);
  };

  /**
   * Common columns accessors.
   * @returns {ITableColumnAccessor}
   */
  private commonColumnsAccessors = (): ITableColumnAccessor[] => {
    return R.compose(
      R.concat([{ key: 'name', accessor: 'name' }]),
      R.ifElse(
        this.query.isDatePeriodsColumnsType,
        R.concat(this.datePeriodsColumnsAccessors()),
        R.concat(this.totalColumnAccessor())
      )
    )([]);
  };

  /**
   *
   * @param   {IProfitLossSheetAccountNode} node
   * @returns {ITableRow}
   */
  private accountNodeToTableRow = (
    node: IProfitLossSheetAccountNode
  ): ITableRow => {
    const columns = this.commonColumnsAccessors();
    const meta = {
      rowTypes: [ProfitLossSheetRowType.ACCOUNT],
      id: node.id,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   *
   * @param   {IProfitLossSheetAccountsNode} node
   * @returns {ITableRow}
   */
  private accountsNodeToTableRow = (
    node: IProfitLossSheetAccountsNode
  ): ITableRow => {
    const columns = this.commonColumnsAccessors();
    const meta = {
      rowTypes: [ProfitLossSheetRowType.ACCOUNTS],
      id: node.id,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   *
   * @param   {IProfitLossSheetEquationNode} node
   * @returns {ITableRow}
   */
  private equationNodeToTableRow = (
    node: IProfitLossSheetEquationNode
  ): ITableRow => {
    const columns = this.commonColumnsAccessors();

    const meta = {
      rowTypes: [ProfitLossSheetRowType.TOTAL],
      id: node.id,
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   *
   * @param   {IProfitLossSheetNode} node
   * @returns {ITableRow}
   */
  private nodeToTableRowCompose = (node: IProfitLossSheetNode): ITableRow => {
    return R.cond([
      [
        this.isNodeType(ProfitLossNodeType.ACCOUNTS),
        this.accountsNodeToTableRow,
      ],
      [
        this.isNodeType(ProfitLossNodeType.EQUATION),
        this.equationNodeToTableRow,
      ],
      [this.isNodeType(ProfitLossNodeType.ACCOUNT), this.accountNodeToTableRow],
    ])(node);
  };

  /**
   *
   * @param   {IProfitLossSheetNode[]} nodes
   * @returns {ITableRow}
   */
  private nodesToTableRowsCompose = (
    nodes: IProfitLossSheetNode[]
  ): ITableRow[] => {
    return this.mapNodesDeep(nodes, this.nodeToTableRowCompose);
  };

  /**
   * Retrieves the table rows.
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    return R.compose(
      this.addTotalRows,
      this.nodesToTableRowsCompose
    )(this.reportData);
  };

  // ----------------------------------
  // # Columns.
  // ----------------------------------
  /**
   * Retrieve total column children columns.
   * @returns {ITableColumn[]}
   */
  private tableColumnChildren = (): ITableColumn[] => {
    return R.compose(
      R.unless(
        R.isEmpty,
        R.concat([
          { key: 'total', label: this.i18n.__('profit_loss_sheet.total') },
        ])
      ),
      R.concat(this.percentageColumns()),
      R.when(
        this.query.isPreviousYearActive,
        R.concat(this.getPreviousYearColumns())
      ),
      R.when(
        this.query.isPreviousPeriodActive,
        R.concat(this.getPreviousPeriodColumns())
      )
    )([]);
  };

  /**
   * Retrieves the total column.
   * @returns {ITableColumn[]}
   */
  private totalColumn = (): ITableColumn[] => {
    return [
      {
        key: 'total',
        label: this.i18n.__('profit_loss_sheet.total'),
        children: this.tableColumnChildren(),
      },
    ];
  };

  /**
   * Retrieves the table columns.
   * @returns {ITableColumn[]}
   */
  public tableColumns = (): ITableColumn[] => {
    return R.compose(
      this.tableColumnsCellIndexing,
      R.concat([
        { key: 'name', label: this.i18n.__('profit_loss_sheet.account_name') },
      ]),
      R.ifElse(
        this.query.isDatePeriodsColumnsType,
        R.concat(this.datePeriodsColumns()),
        R.concat(this.totalColumn())
      )
    )([]);
  };
}
