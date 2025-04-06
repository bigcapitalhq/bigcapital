import { I18nService } from 'nestjs-i18n';
import { IAPAgingSummaryData } from './APAgingSummary.types';
import { AgingSummaryTable } from '../AgingSummary/AgingSummaryTable';
import { ITableColumnAccessor } from '../../types/Table.types';
import { IAgingSummaryQuery } from '../AgingSummary/AgingSummary.types';
import { ITableColumn } from '../../types/Table.types';
import { ITableRow } from '../../types/Table.types';

export class APAgingSummaryTable extends AgingSummaryTable {
  readonly report: IAPAgingSummaryData;

  /**
   * Constructor method.
   * @param {IARAgingSummaryData} data
   * @param {IAgingSummaryQuery} query
   * @param {any} i18n
   */
  constructor(
    data: IAPAgingSummaryData,
    query: IAgingSummaryQuery,
    i18n: I18nService,
  ) {
    super(data, query, i18n);
  }

  /**
   * Retrieves the contacts table rows.
   * @returns {ITableRow[]}
   */
  get contactsRows(): ITableRow[] {
    return this.contactsNodes(this.report.vendors);
  }

  /**
   * Contact name node accessor.
   * @returns {ITableColumnAccessor}
   */
  get contactNameNodeAccessor(): ITableColumnAccessor {
    return { key: 'vendor_name', accessor: 'vendorName' };
  }

  /**
   * Retrieves the contact name table column.
   * @returns {ITableColumn}
   */
  contactNameTableColumn = (): ITableColumn => {
    return { label: 'Vendor name', key: 'vendor_name' };
  };
}
