import * as R from 'ramda';
import { tableRowMapper } from 'utils';
import {
  ITransactionsByVendorsVendor,
  ITableRow,
  ITableColumn,
} from '@/interfaces';
import TransactionsByContactsTableRows from '../TransactionsByContact/TransactionsByContactTableRows';

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
  constructor(vendorsTransactions: ITransactionsByVendorsVendor[], i18n) {
    super();

    this.vendorsTransactions = vendorsTransactions;
    this.i18n = i18n;
  }

  /**
   * Retrieve the table row of vendor details.
   * @param {ITransactionsByVendorsVendor} vendor -
   * @returns {ITableRow[]}
   */
  private vendorDetails = (vendor: ITransactionsByVendorsVendor) => {
    const columns = [
      { key: 'vendorName', accessor: 'vendorName' },
      ...R.repeat({ key: 'empty', value: '' }, 5),
      {
        key: 'closingBalanceValue',
        accessor: 'closingBalance.formattedAmount',
      },
    ];
    return {
      ...tableRowMapper(vendor, columns, { rowTypes: [ROW_TYPE.VENDOR] }),
      children: R.pipe(
        R.when(
          R.always(vendor.transactions.length > 0),
          R.pipe(
            R.concat(this.contactTransactions(vendor)),
            R.prepend(this.contactOpeningBalance(vendor))
          )
        ),
        R.append(this.contactClosingBalance(vendor))
      )([]),
    };
  };

  /**
   * Retrieve the table rows of the vendor section.
   * @param {ITransactionsByVendorsVendor} vendor
   * @returns {ITableRow[]}
   */
  private vendorRowsMapper = (vendor: ITransactionsByVendorsVendor) => {
    return R.pipe(this.vendorDetails)(vendor);
  };

  /**
   * Retrieve the table rows of transactions by vendors report.
   * @param {ITransactionsByVendorsVendor[]} vendors
   * @returns {ITableRow[]}
   */
  public tableRows = (): ITableRow[] => {
    return R.map(this.vendorRowsMapper)(this.vendorsTransactions);
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
