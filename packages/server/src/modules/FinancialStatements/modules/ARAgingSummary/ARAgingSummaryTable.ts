import { IARAgingSummaryData } from './ARAgingSummary.types';
import { AgingSummaryTable } from '../AgingSummary/AgingSummaryTable';
import { IAgingSummaryQuery } from '../AgingSummary/AgingSummary.types';
import { ITableColumnAccessor, ITableRow } from '../../types/Table.types';

export class ARAgingSummaryTable extends AgingSummaryTable {
  readonly report: IARAgingSummaryData;

  /**
   * Constructor method.
   * @param {IARAgingSummaryData} data
   * @param {IAgingSummaryQuery} query
   * @param {any} i18n
   */
  constructor(data: IARAgingSummaryData, query: IAgingSummaryQuery, i18n: any) {
    super(data, query, i18n);
  }

  /**
   * Retrieves the contacts table rows.
   * @returns {ITableRow[]}
   */
  get contactsRows(): ITableRow[] {
    return this.contactsNodes(this.report.customers);
  }

  /**
   * Contact name node accessor.
   * @returns {ITableColumnAccessor}
   */
  get contactNameNodeAccessor(): ITableColumnAccessor {
    return { key: 'customer_name', accessor: 'customerName' };
  }
}
