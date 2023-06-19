import { map } from 'lodash/fp';
import * as R from 'ramda';
import {
  IProjectProfitabilitySummaryData,
  IProjectProfitabilitySummaryProjectNode,
  IProjectProfitabilitySummaryRowType,
  IProjectProfitabilitySummaryTotalNode,
  ITableColumn,
  ITableRow,
} from '@/interfaces';
import { tableRowMapper } from 'utils';

export class ProjectProfitabilitySummaryTable {
  /**
   * Holds the report data.
   * @var {IProjectProfitabilitySummaryPOJO}
   */
  private readonly reportData: IProjectProfitabilitySummaryData;

  /**
   * Constructor method.
   * @param {IProjectProfitabilitySummaryData} reportData
   * @param {} i18n
   */
  constructor(
    reportData: IProjectProfitabilitySummaryData,
    i18n: any
  ) {
    this.reportData = reportData;
    this.i18n = i18n;
  }

  // ----------------------------------
  // # ROWS.
  // ----------------------------------
  /**
   * Retrieves the project node table row.
   * @param {IProjectProfitabilitySummaryProjectNode} node
   * @returns {ITableRow}
   */
  private projectNodeData = (
    node: IProjectProfitabilitySummaryProjectNode
  ): ITableRow => {
    const meta = {
      rowTypes: [IProjectProfitabilitySummaryRowType.PROJECT],
    };
    const columns = [
      { key: 'name', accessor: 'projectName' },
      { key: 'customer_name', accessor: 'customerName' },
      { key: 'income', accessor: 'income.formattedAmount' },
      { key: 'expenses', accessor: 'expenses.formattedAmount' },
      { key: 'profit', accessor: 'profit.formattedAmount' },
    ];
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Retrieves the projects nodes table rows.
   * @param {IProjectProfitabilitySummaryProjectNode[]} nodes
   * @returns {ITableRow[]}
   */
  public projectsNodesData = (
    nodes: IProjectProfitabilitySummaryProjectNode[]
  ): ITableRow[] => {
    return map(this.projectNodeData)(nodes);
  };

  /**
   * Retrieves the projects total table row.
   * @param {IProjectProfitabilitySummaryTotal} totalNode
   * @returns {ITableRow}
   */
  public projectsTotalRow = (
    node: IProjectProfitabilitySummaryTotalNode
  ): ITableRow => {
    const meta = {
      rowTypes: [IProjectProfitabilitySummaryRowType.TOTAL],
    };
    const columns = [
      { key: 'name', value: '' },
      { key: 'customer_name', value: '' },
      { key: 'income', accessor: 'income.formattedAmount' },
      { key: 'expenses', accessor: 'expenses.formattedAmount' },
      { key: 'profit', accessor: 'profit.formattedAmount' },
    ];
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Retrieves the table rows.
   * @returns {ITableRow[]}
   */
  public tableData = (): ITableRow[] => {
    return R.pipe(
      R.concat(this.projectsNodesData(this.reportData.projects)),
      R.append(this.projectsTotalRow(this.reportData.total))
    )([]);
  };

  // ----------------------------------
  // # Columns.
  // ----------------------------------
  /**
   * Retrieved the table columns
   * @returns {ITableColumn[]}
   */
  public tableColumns = (): ITableColumn[] => {
    return [
      { key: 'name', label: 'Project Name' },
      { key: 'customer_name', label: 'Customer Name' },
      { key: 'income', label: 'Income' },
      { key: 'expenses', label: 'Expenses' },
      { key: 'profit', label: 'Profit' },
    ];
  };
}
