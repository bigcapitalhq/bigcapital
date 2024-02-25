import * as R from 'ramda';
import {
  IAgingPeriod,
  IAgingSummaryContact,
  IAgingSummaryData,
  IAgingSummaryQuery,
  IAgingSummaryTotal,
  ITableColumn,
  ITableColumnAccessor,
  ITableRow,
} from '@/interfaces';
import { tableRowMapper } from '@/utils';
import AgingReport from './AgingReport';
import { AgingSummaryRowType } from './_constants';
import { FinancialTable } from '../FinancialTable';
import { FinancialSheetStructure } from '../FinancialSheetStructure';

export default abstract class AgingSummaryTable extends R.compose(
  FinancialSheetStructure,
  FinancialTable
)(AgingReport) {
  protected readonly report: IAgingSummaryData;
  protected readonly query: IAgingSummaryQuery;
  protected readonly agingPeriods: IAgingPeriod[];
  protected readonly i18n: any;

  /**
   * Constructor method.
   * @param {IARAgingSummaryData} data
   * @param {IAgingSummaryQuery} query
   * @param {any} i18n
   */
  constructor(data: IAgingSummaryData, query: IAgingSummaryQuery, i18n: any) {
    super();

    this.report = data;
    this.i18n = i18n;
    this.query = query;

    this.agingPeriods = this.agingRangePeriods(
      this.query.asDate,
      this.query.agingDaysBefore,
      this.query.agingPeriods
    );
  }

  // -------------------------
  // # Accessors.
  // -------------------------
  /**
   * Aging accessors of contact and total nodes.
   * @param {IAgingSummaryContact | IAgingSummaryTotal} node
   * @returns {ITableColumnAccessor[]}
   */
  protected agingNodeAccessors = (
    node: IAgingSummaryContact | IAgingSummaryTotal
  ): ITableColumnAccessor[] => {
    return node.aging.map((aging, index) => ({
      key: 'aging_period',
      accessor: `aging[${index}].total.formattedAmount`,
    }));
  };

  /**
   * Contact name node accessor.
   * @returns {ITableColumnAccessor}
   */
  protected get contactNameNodeAccessor(): ITableColumnAccessor {
    return { key: 'customer_name', accessor: 'customerName' };
  }

  /**
   * Retrieves the common columns for all report nodes.
   * @param {IAgingSummaryContact}
   * @returns {ITableColumnAccessor[]}
   */
  protected contactNodeAccessors = (
    node: IAgingSummaryContact
  ): ITableColumnAccessor[] => {
    return R.compose(
      R.concat([
        this.contactNameNodeAccessor,
        { key: 'current', accessor: 'current.formattedAmount' },
        ...this.agingNodeAccessors(node),
        { key: 'total', accessor: 'total.formattedAmount' },
      ])
    )([]);
  };

  /**
   * Retrieves the contact name table row.
   * @param {IAgingSummaryContact} node -
   * @return {ITableRow}
   */
  protected contactNameNode = (node: IAgingSummaryContact): ITableRow => {
    const columns = this.contactNodeAccessors(node);
    const meta = {
      rowTypes: [AgingSummaryRowType.Contact],
    };
    return tableRowMapper(node, columns, meta);
  };

  /**
   * Maps the customers nodes to table rows.
   * @param {IAgingSummaryContact[]} nodes
   * @returns {ITableRow[]}
   */
  protected contactsNodes = (nodes: IAgingSummaryContact[]): ITableRow[] => {
    return nodes.map(this.contactNameNode);
  };

  /**
   * Retrieves the common columns for all report nodes.
   * @param {IAgingSummaryTotal}
   * @returns {ITableColumnAccessor[]}
   */
  protected totalNodeAccessors = (
    node: IAgingSummaryTotal
  ): ITableColumnAccessor[] => {
    return R.compose(
      R.concat([
        { key: 'blank', value: '' },
        { key: 'current', accessor: 'current.formattedAmount' },
        ...this.agingNodeAccessors(node),
        { key: 'total', accessor: 'total.formattedAmount' },
      ])
    )([]);
  };

  /**
   * Retrieves the total row of the given report total node.
   * @param {IAgingSummaryTotal} node
   * @returns {ITableRow}
   */
  protected totalNode = (node: IAgingSummaryTotal): ITableRow => {
    const columns = this.totalNodeAccessors(node);
    const meta = {
      rowTypes: [AgingSummaryRowType.Total],
    };
    return tableRowMapper(node, columns, meta);
  };

  // -------------------------
  // # Computed Rows.
  // -------------------------
  /**
   * Retrieves the contacts table rows.
   * @returns {ITableRow[]}
   */
  protected get contactsRows(): ITableRow[] {
    return [];
  }

  /**
   * Table total row.
   * @returns {ITableRow}
   */
  protected get totalRow(): ITableRow {
    return this.totalNode(this.report.total);
  }

  /**
   * Retrieves the table rows.
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    return R.compose(
      R.unless(R.isEmpty, R.append(this.totalRow)),
      R.concat(this.contactsRows)
    )([]);
  };

  // -------------------------
  // # Columns.
  // -------------------------
  /**
   * Retrieves the aging table columns.
   * @returns {ITableColumn[]}
   */
  protected agingTableColumns = (): ITableColumn[] => {
    return this.agingPeriods.map((agingPeriod) => {
      return {
        label: `${agingPeriod.beforeDays} - ${
          agingPeriod.toDays || 'And Over'
        }`,
        key: 'aging_period',
      };
    });
  };

  /**
   * Retrieves the contact name table column.
   * @returns {ITableColumn}
   */
  protected contactNameTableColumn = (): ITableColumn => {
    return { label: 'Customer name', key: 'customer_name' };
  };

  /**
   * Retrieves the report columns.
   * @returns {ITableColumn}
   */
  public tableColumns = (): ITableColumn[] => {
    return R.compose(this.tableColumnsCellIndexing)([
      this.contactNameTableColumn(),
      { label: 'Current', key: 'current' },
      ...this.agingTableColumns(),
      { label: 'Total', key: 'total' },
    ]);
  };
}
