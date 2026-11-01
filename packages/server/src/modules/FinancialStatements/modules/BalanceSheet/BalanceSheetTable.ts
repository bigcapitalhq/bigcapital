import { flow, constant } from 'fp-ts/function';
import { ifElse, unless } from '@/common/fp';
import { isEmpty } from 'lodash';
import { I18nService } from 'nestjs-i18n';
import {
  IBalanceSheetStatementData,
  IBalanceSheetQuery,
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
  IBalanceSheetDataNode,
  IBalanceSheetNetIncomeNode,
  IBalanceSheetAccountNode,
  IBalanceSheetAccountsNode,
  IBalanceSheetAggregateNode,
} from './BalanceSheet.types';
import {
  ITableColumnAccessor,
  ITableColumn,
  ITableRow,
} from '../../types/Table.types';
import { tableRowMapper } from '../../utils/Table.utils';
import { FinancialSheet } from '../../common/FinancialSheet';
import { BalanceSheetComparsionPreviousYear } from './BalanceSheetComparsionPreviousYear';
import { IROW_TYPE, DISPLAY_COLUMNS_BY } from './constants';
import { BalanceSheetComparsionPreviousPeriod } from './BalanceSheetComparsionPreviousPeriod';
import { BalanceSheetPercentage } from './BalanceSheetPercentage';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { BalanceSheetBase } from './BalanceSheetBase';
import { BalanceSheetTablePercentage } from './BalanceSheetTablePercentage';
import { BalanceSheetTablePreviousYear } from './BalanceSheetTablePreviousYear';
import { BalanceSheetTablePreviousPeriod } from './BalanceSheetTablePreviousPeriod';
import { FinancialTable } from '../../common/FinancialTable';
import { BalanceSheetQuery } from './BalanceSheetQuery';
import { BalanceSheetTableDatePeriods } from './BalanceSheetTableDatePeriods';
import { BALANCE_SHEET_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';

export class BalanceSheetTable extends BalanceSheetTablePreviousPeriod(
  flow(
    BalanceSheetBase,
    FinancialTable,
    FinancialSheetStructure,
    BalanceSheetPercentage,
    BalanceSheetComparsionPreviousPeriod,
    BalanceSheetComparsionPreviousYear,
    BalanceSheetTablePercentage,
    BalanceSheetTableDatePeriods,
    BalanceSheetTablePreviousYear,
  )(FinancialSheet),
) {
  public i18n: I18nService;

  /**
   * Balance sheet data.
   * @param {IBalanceSheetStatementData}
   */
  public reportData: IBalanceSheetStatementData;

  /**
   * Balance sheet query.
   * @parma {BalanceSheetQuery}
   */
  public query: BalanceSheetQuery;

  /**
   * Constructor method.
   * @param {IBalanceSheetStatementData} reportData -
   * @param {IBalanceSheetQuery} query -
   */
  constructor(
    reportData: IBalanceSheetStatementData,
    query: IBalanceSheetQuery,
    i18n: any,
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
  public isNodeType =
    (type: string) =>
    (node): boolean => {
      return node.nodeType === type;
    };

  // -------------------------
  // # Accessors.
  // -------------------------
  /**
   * Retrieve the common columns for all report nodes.
   * @param {ITableColumnAccessor[]}
   */
  public commonColumnsAccessors = (): ITableColumnAccessor[] => {
    return flow(
      ifElse(
        constant(this.isDisplayColumnsBy(DISPLAY_COLUMNS_BY.DATE_PERIODS)),
        (accessors: ITableColumnAccessor[]) => [
          ...this.datePeriodsColumnsAccessors(),
          ...accessors,
        ],
        (accessors: ITableColumnAccessor[]) => [
          ...this.totalColumnAccessor(),
          ...accessors,
        ],
      ),
      (accessors: ITableColumnAccessor[]) => [
        { key: BALANCE_SHEET_COLUMN_KEYS.NAME, accessor: 'name' },
        ...accessors,
      ],
    )([]);
  };

  /**
   * Retrieve the total column accessor.
   * @return {ITableColumnAccessor[]}
   */
  public totalColumnAccessor = (): ITableColumnAccessor[] => {
    return flow(
      (accessors: ITableColumnAccessor[]) => [
        ...this.previousPeriodColumnAccessor(),
        ...accessors,
      ],
      (accessors: ITableColumnAccessor[]) => [
        ...this.previousYearColumnAccessor(),
        ...accessors,
      ],
      (accessors: ITableColumnAccessor[]) => [
        ...this.percentageColumnsAccessor(),
        ...accessors,
      ],
      (accessors: ITableColumnAccessor[]) => [
        {
          key: BALANCE_SHEET_COLUMN_KEYS.TOTAL,
          accessor: 'total.formattedAmount',
        },
        ...accessors,
      ],
    )([]);
  };

  /**
   * Retrieves the table row from the given report aggregate node.
   * @param {IBalanceSheetAggregateNode} node
   * @returns {ITableRow}
   */
  public aggregateNodeTableRowsMapper = (
    node: IBalanceSheetAggregateNode,
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
  public accountsNodeTableRowsMapper = (
    node: IBalanceSheetAccountsNode,
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
  public accountNodeTableRowsMapper = (
    node: IBalanceSheetAccountNode,
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
  public netIncomeNodeTableRowsMapper = (
    node: IBalanceSheetNetIncomeNode,
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
  public nodeToTableRowsMapper = (node: IBalanceSheetDataNode): ITableRow => {
    if (this.isNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE)(node)) {
      return this.aggregateNodeTableRowsMapper(
        node as IBalanceSheetAggregateNode,
      );
    }
    if (this.isNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS)(node)) {
      return this.accountsNodeTableRowsMapper(
        node as IBalanceSheetAccountsNode,
      );
    }
    if (this.isNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNT)(node)) {
      return this.accountNodeTableRowsMapper(node as IBalanceSheetAccountNode);
    }
    if (this.isNodeType(BALANCE_SHEET_SCHEMA_NODE_TYPE.NET_INCOME)(node)) {
      return this.netIncomeNodeTableRowsMapper(
        node as IBalanceSheetNetIncomeNode,
      );
    }
    return undefined;
  };

  /**
   * Mappes the given report sections to table rows.
   * @param  {IBalanceSheetDataNode[]} nodes -
   * @return {ITableRow}
   */
  public nodesToTableRowsMapper = (
    nodes: IBalanceSheetDataNode[],
  ): ITableRow[] => {
    return this.mapNodesDeep(nodes, this.nodeToTableRowsMapper);
  };

  /**
   * Retrieves the total children columns.
   * @returns {ITableColumn[]}
   */
  public totalColumnChildren = (): ITableColumn[] => {
    return flow(
      (columns: ITableColumn[]) => [
        ...this.previousPeriodColumns(),
        ...columns,
      ],
      (columns: ITableColumn[]) => [
        ...this.getPreviousYearColumns(),
        ...columns,
      ],
      (columns: ITableColumn[]) => [...this.percentageColumns(), ...columns],
      unless(isEmpty, (columns: ITableColumn[]) => [
        {
          key: BALANCE_SHEET_COLUMN_KEYS.TOTAL,
          label: this.i18n.t('balance_sheet.total'),
        },
        ...columns,
      ]),
    )([]);
  };

  /**
   * Retrieve the total column.
   * @returns {ITableColumn[]}
   */
  public totalColumn = (): ITableColumn[] => {
    return [
      {
        key: BALANCE_SHEET_COLUMN_KEYS.TOTAL,
        label: this.i18n.t('balance_sheet.total'),
        children: this.totalColumnChildren(),
      },
    ];
  };

  /**
   * Retrieve the report table rows.
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    return flow(
      this.nodesToTableRowsMapper,
      this.addTotalRows,
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
    return flow(
      ifElse(
        this.query.isDatePeriodsColumnsType,
        (columns: ITableColumn[]) => [...this.datePeriodsColumns(), ...columns],
        (columns: ITableColumn[]) => [...this.totalColumn(), ...columns],
      ),
      (columns: ITableColumn[]) => [
        {
          key: BALANCE_SHEET_COLUMN_KEYS.NAME,
          label: this.i18n.t('balance_sheet.account_name'),
        },
        ...columns,
      ],
      this.tableColumnsCellIndexing,
    )([]);
  };
}
