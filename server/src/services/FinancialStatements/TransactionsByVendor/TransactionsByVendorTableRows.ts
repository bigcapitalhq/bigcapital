import * as R from 'ramda';
import { tableRowMapper } from 'utils';
import { ITransactionsByVendorsVendor, ITableRow } from 'interfaces';
import TransactionsByContactsTableRows from '../TransactionsByContact/TransactionsByContactTableRows';

enum ROW_TYPE {
  OPENING_BALANCE = 'OPENING_BALANCE',
  CLOSING_BALANCE = 'CLOSING_BALANCE',
  TRANSACTION = 'TRANSACTION',
  VENDOR = 'VENDOR',
}

export default class TransactionsByVendorsTableRows extends TransactionsByContactsTableRows {
  /**
   * Retrieve the table row of vendor details.
   * @param {ITransactionsByVendorsVendor} vendor -
   * @returns {ITableRow[]}
   */
  private vendorDetails(vendor: ITransactionsByVendorsVendor) {
    const columns = [{ key: 'vendorName', accessor: 'vendorName' }];

    return {
      ...tableRowMapper(vendor, columns, { rowTypes: [ROW_TYPE.VENDOR] }),
      children: R.pipe(
        R.append(this.contactOpeningBalance(vendor)),
        R.concat(this.contactTransactions(vendor)),
        R.append(this.contactClosingBalance(vendor))
      )([]),
    };
  }

  /**
   * Retrieve the table rows of the vendor section.
   * @param {ITransactionsByVendorsVendor} vendor
   * @returns {ITableRow[]}
   */
  private vendorRowsMapper(vendor: ITransactionsByVendorsVendor) {
    return R.pipe(R.append(this.vendorDetails(vendor))).bind(this)([]);
  }

  /**
   * Retrieve the table rows of transactions by vendors report.
   * @param {ITransactionsByVendorsVendor[]} vendors
   * @returns {ITableRow[]}
   */
  public tableRows(vendors: ITransactionsByVendorsVendor[]): ITableRow[] {
    return R.map(this.vendorRowsMapper.bind(this))(vendors);
  }
}
