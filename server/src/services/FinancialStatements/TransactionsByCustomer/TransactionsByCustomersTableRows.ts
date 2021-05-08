import * as R from 'ramda';
import { tableRowMapper, tableMapper } from 'utils';
import { ITransactionsByCustomersCustomer, ITableRow } from 'interfaces';
import TransactionsByContactsTableRows from '../TransactionsByContact/TransactionsByContactTableRows';

enum ROW_TYPE {
  OPENING_BALANCE = 'OPENING_BALANCE',
  CLOSING_BALANCE = 'CLOSING_BALANCE',
  TRANSACTION = 'TRANSACTION',
  CUSTOMER = 'CUSTOMER',
}

export default class TransactionsByCustomersTableRows extends TransactionsByContactsTableRows {
  /**
   * Retrieve the table row of customer details.
   * @param {ITransactionsByCustomersCustomer} customer -
   * @returns {ITableRow[]}
   */
  private customerDetails(customer: ITransactionsByCustomersCustomer) {
    const columns = [
      { key: 'customerName', accessor: 'customerName' },
      ...R.repeat({ key: 'empty', value: '' }, 5),
      { key: 'closingBalanceValue', accessor: 'closingBalance.formattedAmount' },
    ];

    return {
      ...tableRowMapper(customer, columns, { rowTypes: [ROW_TYPE.CUSTOMER] }),
      children: R.pipe(
        R.when(
          R.always(customer.transactions.length > 0),
          R.pipe(
            R.concat(this.contactTransactions(customer)),
            R.prepend(this.contactOpeningBalance(customer)),
          ),
        ),
        R.append(this.contactClosingBalance(customer))
      )([]),
    };
  }

  /**
   * Retrieve the table rows of the customer section.
   * @param {ITransactionsByCustomersCustomer} customer
   * @returns {ITableRow[]}
   */
  private customerRowsMapper(customer: ITransactionsByCustomersCustomer) {
    return R.pipe(this.customerDetails).bind(this)(customer);
  }

  /**
   * Retrieve the table rows of transactions by customers report.
   * @param {ITransactionsByCustomersCustomer[]} customers
   * @returns {ITableRow[]}
   */
  public tableRows(customers: ITransactionsByCustomersCustomer[]): ITableRow[] {
    return R.map(this.customerRowsMapper.bind(this))(customers);
  }
}
