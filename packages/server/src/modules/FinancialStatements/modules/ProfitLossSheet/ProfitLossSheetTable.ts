import { flow } from 'fp-ts/function';
import { ifElse, unless, when } from '@/common/fp';
import { isEmpty } from 'lodash';
import {
  IProfitLossSheetQuery,
  IProfitLossSheetAccountsNode,
  ProfitLossNodeType,
  ProfitLossSheetRowType,
  IProfitLossSheetNode,
  IProfitLossSheetEquationNode,
  IProfitLossSheetAccountNode,
} from './ProfitLossSheet.types';
import {
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '../../types/Table.types';
import { ProfitLossSheetBase } from './ProfitLossSheetBase';
import { ProfitLossSheetTablePercentage } from './ProfitLossSheetTablePercentage';
import { ProfitLossSheetQuery } from './ProfitLossSheetQuery';
import { ProfitLossTablePreviousPeriod } from './ProfitLossTablePreviousPeriod';
import { ProfitLossTablePreviousYear } from './ProfitLossTablePreviousYear';
import { ProfitLossSheetTableDatePeriods } from './ProfitLossSheetTableDatePeriods';
import { I18nService } from 'nestjs-i18n';
import { FinancialSheetStructure } from '../../common/FinancialSheetStructure';
import { FinancialTable } from '../../common/FinancialTable';
import { tableRowMapper } from '../../utils/Table.utils';
import { PROFIT_LOSS_COLUMN_KEYS } from '../../common/constants/tableColumnKeys';
import { GConstructor } from '@/common/types/Constructor';
import { FinancialSheet } from '../../common/FinancialSheet';

export class ProfitLossSheetTable extends flow(
  ProfitLossTablePreviousPeriod,
  ProfitLossTablePreviousYear,
  ProfitLossSheetTablePercentage,
  ProfitLossSheetTableDatePeriods,
  ProfitLossSheetBase,
  FinancialSheetStructure,
  FinancialTable,
)(class {} as GConstructor<FinancialSheet>) {
  readonly query: ProfitLossSheetQuery;
  readonly i18n: I18nService;

  public reportData: IProfitLossSheetNode[];

  /**
   * Constructor method.
   * @param {} date
   * @param {IProfitLossSheetQuery} query
   */
  constructor(data: any, query: IProfitLossSheetQuery, i18n: I18nService) {
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
    return flow(
      when(
        this.query.isPreviousPeriodActive,
        (accessors: ITableColumnAccessor[]) => [
          ...this.previousPeriodColumnAccessor(),
          ...accessors,
        ],
      ),
      when(
        this.query.isPreviousYearActive,
        (accessors: ITableColumnAccessor[]) => [
          ...this.previousYearColumnAccessor(),
          ...accessors,
        ],
      ),
      (accessors: ITableColumnAccessor[]) => [
        ...this.percentageColumnsAccessor(),
        ...accessors,
      ],
      (accessors: ITableColumnAccessor[]) => [
        {
          key: PROFIT_LOSS_COLUMN_KEYS.TOTAL,
          accessor: 'total.formattedAmount',
        },
        ...accessors,
      ],
    )([]);
  };

  /**
   * Common columns accessors.
   * @returns {ITableColumnAccessor}
   */
  private commonColumnsAccessors = (): ITableColumnAccessor[] => {
    return flow(
      ifElse(
        this.query.isDatePeriodsColumnsType,
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
        { key: PROFIT_LOSS_COLUMN_KEYS.NAME, accessor: 'name' },
        ...accessors,
      ],
    )([]);
  };

  /**
   *
   * @param   {IProfitLossSheetAccountNode} node
   * @returns {ITableRow}
   */
  private accountNodeToTableRow = (
    node: IProfitLossSheetAccountNode,
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
    node: IProfitLossSheetAccountsNode,
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
    node: IProfitLossSheetEquationNode,
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
    if (this.isNodeType(ProfitLossNodeType.ACCOUNTS)(node)) {
      return this.accountsNodeToTableRow(node as IProfitLossSheetAccountsNode);
    }
    if (this.isNodeType(ProfitLossNodeType.EQUATION)(node)) {
      return this.equationNodeToTableRow(node as IProfitLossSheetEquationNode);
    }
    if (this.isNodeType(ProfitLossNodeType.ACCOUNT)(node)) {
      return this.accountNodeToTableRow(node as IProfitLossSheetAccountNode);
    }
    return undefined;
  };

  /**
   *
   * @param   {IProfitLossSheetNode[]} nodes
   * @returns {ITableRow}
   */
  private nodesToTableRowsCompose = (
    nodes: IProfitLossSheetNode[],
  ): ITableRow[] => {
    return this.mapNodesDeep(nodes, this.nodeToTableRowCompose);
  };

  /**
   * Retrieves the table rows.
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    return flow(
      this.nodesToTableRowsCompose,
      this.addTotalRows,
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
    return flow(
      when(this.query.isPreviousPeriodActive, (columns: ITableColumn[]) => [
        ...this.getPreviousPeriodColumns(),
        ...columns,
      ]),
      when(this.query.isPreviousYearActive, (columns: ITableColumn[]) => [
        ...this.getPreviousYearColumns(),
        ...columns,
      ]),
      (columns: ITableColumn[]) => [...this.percentageColumns(), ...columns],
      unless(isEmpty, (columns: ITableColumn[]) => [
        {
          key: PROFIT_LOSS_COLUMN_KEYS.TOTAL,
          label: this.i18n.t('profit_loss_sheet.total'),
        },
        ...columns,
      ]),
    )([]);
  };

  /**
   * Retrieves the total column.
   * @returns {ITableColumn[]}
   */
  private totalColumn = (): ITableColumn[] => {
    return [
      {
        key: PROFIT_LOSS_COLUMN_KEYS.TOTAL,
        label: this.i18n.t('profit_loss_sheet.total'),
        children: this.tableColumnChildren(),
      },
    ];
  };

  /**
   * Retrieves the table columns.
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
          key: PROFIT_LOSS_COLUMN_KEYS.NAME,
          label: this.i18n.t('profit_loss_sheet.account_name'),
        },
        ...columns,
      ],
      this.tableColumnsCellIndexing,
    )([]);
  };
}
