import * as R from 'ramda';
import { tableRowMapper, tableMapper } from 'utils';
import { ITransactionsByCustomersCustomer, ITableRow } from 'interfaces';

enum ROW_TYPE {
  OPENING_BALANCE = 'OPENING_BALANCE',
  CLOSING_BALANCE = 'CLOSING_BALANCE',
  TRANSACTION = 'TRANSACTION',
  CUSTOMER = 'CUSTOMER',
}

export default class TransactionsByCustomersTableRows {
  /**
   * Retrieve the table rows of customer transactions.
   * @param {ITransactionsByCustomersCustomer} customer
   * @returns {ITableRow[]}
   */
  private customerTransactions(
    customer: ITransactionsByCustomersCustomer
  ): ITableRow[] {
    const columns = [
      { key: 'date', accessor: 'date' },
      { key: 'account', accessor: 'account.name' },
      { key: 'referenceType', accessor: 'referenceType' },
      { key: 'transactionType', accessor: 'transactionType' },
      { key: 'credit', accessor: 'credit.formattedAmount' },
      { key: 'debit', accessor: 'debit.formattedAmount' },
    ];
    return tableMapper(customer.transactions, columns, {
      rowTypes: [ROW_TYPE.TRANSACTION]
    });
  }

  /**
   * Retrieve the table row of customer opening balance.
   * @param {ITransactionsByCustomersCustomer} customer
   * @returns {ITableRow}
   */
  private customerOpeningBalance(
    customer: ITransactionsByCustomersCustomer
  ): ITableRow {
    const columns = [
      { key: 'openingBalanceLabel', value: 'Opening balance' },
      {
        key: 'openingBalanceValue',
        accessor: 'openingBalance.formattedAmount',
      },
    ];
    return tableRowMapper(customer, columns, {
      rowTypes: [ROW_TYPE.OPENING_BALANCE]
    });
  }

  /**
   * Retrieve the table row of customer closing balance.
   * @param {ITransactionsByCustomersCustomer} customer -
   * @returns {ITableRow}
   */
  private customerClosingBalance(
    customer: ITransactionsByCustomersCustomer
  ): ITableRow {
    const columns = [
      { key: 'openingBalanceLabel', value: 'Closing balance' },
      {
        key: 'openingBalanceValue',
        accessor: 'closingBalance.formattedAmount',
      },
    ];
    return tableRowMapper(customer, columns, {
      rowTypes: [ROW_TYPE.CLOSING_BALANCE]
    });
  }

  /**
   * Retrieve the table row of customer details.
   * @param {ITransactionsByCustomersCustomer} customer - 
   * @returns {ITableRow[]}
   */
  private customerDetails(
    customer: ITransactionsByCustomersCustomer
  ) {
    const columns = [{ key: 'customerName', accessor: 'customerName' }];

    return {
      ...tableRowMapper(customer, columns, { rowTypes: [ROW_TYPE.CUSTOMER] }),
      children: R.pipe(
        R.append(this.customerOpeningBalance(customer)),
        R.concat(this.customerTransactions(customer)),
        R.append(this.customerClosingBalance(customer)),
      )([]),
    }
  }

  /**
   * Retrieve the table rows of the customer section.
   * @param {ITransactionsByCustomersCustomer} customer 
   * @returns {ITableRow[]}
   */
  private customerRowsMapper(customer: ITransactionsByCustomersCustomer) {
    return R.pipe(
      R.append(this.customerDetails(customer)),
    ).bind(this)([]);
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
