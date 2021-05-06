import moment from 'moment';
import { tableMapper, tableRowMapper } from 'utils';
import {
  ITransactionsByContactsContact,
  ITableRow,
} from 'interfaces';

enum ROW_TYPE {
  OPENING_BALANCE = 'OPENING_BALANCE',
  CLOSING_BALANCE = 'CLOSING_BALANCE',
  TRANSACTION = 'TRANSACTION',
  CUSTOMER = 'CUSTOMER',
}

export default class TransactionsByContactsTableRows {
  
  private dateAccessor(value) {
    return moment(value.date).format('YYYY MMM DD');
  }

  /**
   * Retrieve the table rows of contact transactions.
   * @param {ITransactionsByCustomersCustomer} contact
   * @returns {ITableRow[]}
   */
  protected contactTransactions(
    contact: ITransactionsByContactsContact
  ): ITableRow[] {
    const columns = [
      { key: 'date', accessor: this.dateAccessor },
      { key: 'account', accessor: 'account.name' },
      { key: 'referenceType', accessor: 'referenceType' },
      { key: 'transactionType', accessor: 'transactionType' },
      { key: 'credit', accessor: 'credit.formattedAmount' },
      { key: 'debit', accessor: 'debit.formattedAmount' },
    ];
    return tableMapper(contact.transactions, columns, {
      rowTypes: [ROW_TYPE.TRANSACTION],
    });
  }

  /**
   * Retrieve the table row of contact opening balance.
   * @param {ITransactionsByCustomersCustomer} contact
   * @returns {ITableRow}
   */
  protected contactOpeningBalance(
    contact: ITransactionsByContactsContact
  ): ITableRow {
    const columns = [
      { key: 'openingBalanceLabel', value: 'Opening balance' },
      {
        key: 'openingBalanceValue',
        accessor: 'openingBalance.formattedAmount',
      },
    ];
    return tableRowMapper(contact, columns, {
      rowTypes: [ROW_TYPE.OPENING_BALANCE],
    });
  }

  /**
   * Retrieve the table row of contact closing balance.
   * @param {ITransactionsByCustomersCustomer} contact -
   * @returns {ITableRow}
   */
  protected contactClosingBalance(
    contact: ITransactionsByContactsContact
  ): ITableRow {
    const columns = [
      { key: 'closingBalanceLabel', value: 'Closing balance' },
      {
        key: 'closingBalanceValue',
        accessor: 'closingBalance.formattedAmount',
      },
    ];
    return tableRowMapper(contact, columns, {
      rowTypes: [ROW_TYPE.CLOSING_BALANCE],
    });
  }
}
