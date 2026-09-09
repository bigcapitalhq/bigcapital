import { I18nService } from 'nestjs-i18n';
import { constant, flow } from 'fp-ts/function';
import { when } from '@/common/fp';
import { ITransactionsByCustomersCustomer } from './TransactionsByCustomer.types';
import { ITableRow, ITableColumn } from '../../types/Table.types';
import { TransactionsByContactsTableRows } from '../TransactionsByContact/TransactionsByContactTableRows';
import { tableRowMapper } from '../../utils/Table.utils';

enum ROW_TYPE {
  OPENING_BALANCE = 'OPENING_BALANCE',
  CLOSING_BALANCE = 'CLOSING_BALANCE',
  TRANSACTION = 'TRANSACTION',
  CUSTOMER = 'CUSTOMER',
}

export class TransactionsByCustomersTable extends TransactionsByContactsTableRows {
  private customersTransactions: ITransactionsByCustomersCustomer[];

  /**
   * Constructor method.
   * @param {ITransactionsByCustomersCustomer[]} customersTransactions - Customers transactions.
   */
  constructor(
    customersTransactions: ITransactionsByCustomersCustomer[],
    i18n: I18nService,
    dateFormat: string,
  ) {
    super();
    this.customersTransactions = customersTransactions;
    this.i18n = i18n;
    this.dateFormat = dateFormat;
  }

  /**
   * Retrieve the table row of customer details.
   * @param {ITransactionsByCustomersCustomer} customer -
   * @returns {ITableRow[]}
   */
  private customerDetails = (
    customer: ITransactionsByCustomersCustomer,
  ): ITableRow => {
    const columns = [
      { key: 'customerName', accessor: 'customerName' },
      ...Array(5).fill({ key: 'empty', value: '' }),
      {
        key: 'closingBalanceValue',
        accessor: 'closingBalance.formattedAmount',
      },
    ];

    return {
      ...tableRowMapper(customer, columns, { rowTypes: [ROW_TYPE.CUSTOMER] }),
      children: flow(
        when(
          constant(customer.transactions.length > 0),
          (rows: ITableRow[]) => [
            this.contactOpeningBalance(customer),
            ...this.contactTransactions(customer),
            ...rows,
          ],
        ),
        (rows: ITableRow[]) => [...rows, this.contactClosingBalance(customer)],
      )([]),
    };
  };

  /**
   * Retrieve the table rows of the customer section.
   * @param {ITransactionsByCustomersCustomer} customer - Customer object.
   * @returns {ITableRow[]} - Table rows.
   */
  private customerRowsMapper = (
    customer: ITransactionsByCustomersCustomer,
  ): ITableRow => {
    return this.customerDetails(customer);
  };

  /**
   * Retrieve the table rows of transactions by customers report.
   * @param {ITransactionsByCustomersCustomer[]} customers - Customer objects.
   * @returns {ITableRow[]} - Table rows.
   */
  public tableRows = (): ITableRow[] => {
    return this.customersTransactions.map(this.customerRowsMapper);
  };

  /**
   * Retrieve the table columns of transactions by customers report.
   * @returns {ITableColumn[]}
   */
  public tableColumns = (): ITableColumn[] => {
    return [
      { key: 'customer_name', label: 'Customer name' },
      { key: 'account_name', label: 'Account Name' },
      { key: 'ref_type', label: 'Reference Type' },
      { key: 'transaction_type', label: 'Transaction Type' },
      { key: 'credit', label: 'Credit' },
      { key: 'debit', label: 'Debit' },
      { key: 'running_balance', label: 'Running Balance' },
    ];
  };
}
