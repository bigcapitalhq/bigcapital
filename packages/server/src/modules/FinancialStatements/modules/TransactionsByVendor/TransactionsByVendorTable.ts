import { I18nService } from 'nestjs-i18n';
import { constant, flow } from 'fp-ts/function';
import { when } from '@/common/fp';
import { ITransactionsByVendorsVendor } from './TransactionsByVendor.types';
import { TransactionsByContactsTableRows } from '../TransactionsByContact/TransactionsByContactTableRows';
import { tableRowMapper } from '../../utils/Table.utils';
import { ITableRow, ITableColumn } from '../../types/Table.types';

enum ROW_TYPE {
  OPENING_BALANCE = 'OPENING_BALANCE',
  CLOSING_BALANCE = 'CLOSING_BALANCE',
  TRANSACTION = 'TRANSACTION',
  VENDOR = 'VENDOR',
}

export class TransactionsByVendorsTable extends TransactionsByContactsTableRows {
  private vendorsTransactions: ITransactionsByVendorsVendor[];

  /**
   * Constructor method.
   * @param {ITransactionsByVendorsVendor[]} vendorsTransactions -
   * @param {any} i18n
   */
  constructor(
    vendorsTransactions: ITransactionsByVendorsVendor[],
    i18n: I18nService,
    dateFormat: string,
  ) {
    super();

    this.vendorsTransactions = vendorsTransactions;
    this.i18n = i18n;
    this.dateFormat = dateFormat;
  }

  /**
   * Retrieve the table row of vendor details.
   * @param {ITransactionsByVendorsVendor} vendor -
   * @returns {ITableRow[]}
   */
  private vendorDetails = (vendor: ITransactionsByVendorsVendor) => {
    const columns = [
      { key: 'vendorName', accessor: 'vendorName' },
      ...Array(5).fill({ key: 'empty', value: '' }),
      {
        key: 'closingBalanceValue',
        accessor: 'closingBalance.formattedAmount',
      },
    ];
    return {
      ...tableRowMapper(vendor, columns, { rowTypes: [ROW_TYPE.VENDOR] }),
      children: flow(
        when(constant(vendor.transactions.length > 0), (rows: ITableRow[]) => [
          this.contactOpeningBalance(vendor),
          ...this.contactTransactions(vendor),
          ...rows,
        ]),
        (rows: ITableRow[]) => [...rows, this.contactClosingBalance(vendor)],
      )([]),
    };
  };

  /**
   * Retrieve the table rows of the vendor section.
   * @param {ITransactionsByVendorsVendor} vendor
   * @returns {ITableRow[]}
   */
  private vendorRowsMapper = (vendor: ITransactionsByVendorsVendor) => {
    return this.vendorDetails(vendor);
  };

  /**
   * Retrieve the table rows of transactions by vendors report.
   * @param {ITransactionsByVendorsVendor[]} vendors
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    return this.vendorsTransactions.map(this.vendorRowsMapper);
  };

  /**
   * Retrieve the table columns of transactions by vendors report.
   * @returns {ITableColumn[]}
   */
  public tableColumns = (): ITableColumn[] => {
    return [
      { key: 'vendor_name', label: 'Vendor name' },
      { key: 'account_name', label: 'Account Name' },
      { key: 'ref_type', label: 'Reference Type' },
      { key: 'transaction_type', label: 'Transaction Type' },
      { key: 'credit', label: 'Credit' },
      { key: 'debit', label: 'Debit' },
      { key: 'running_balance', label: 'Running Balance' },
    ];
  };
}
