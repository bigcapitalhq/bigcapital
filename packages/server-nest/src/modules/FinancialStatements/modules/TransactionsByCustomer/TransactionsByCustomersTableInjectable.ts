import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import {
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersTable,
} from './TransactionsByCustomer.types';
import { TransactionsByCustomersSheet } from './TransactionsByCustomersService';
import { TransactionsByCustomersTable } from './TransactionsByCustomersTable';

@Injectable()
export class TransactionsByCustomersTableInjectable {
  constructor(
    private readonly transactionsByCustomerService: TransactionsByCustomersSheet,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the transactions by customers sheet in table format.
   * @param {ITransactionsByCustomersFilter} filter - Filter object.
   * @returns {Promise<ITransactionsByCustomersFilter>} - Transactions by customers table.
   */
  public async table(
    filter: ITransactionsByCustomersFilter,
  ): Promise<ITransactionsByCustomersTable> {
    const customersTransactions =
      await this.transactionsByCustomerService.transactionsByCustomers(filter);

    const table = new TransactionsByCustomersTable(
      customersTransactions.data,
      this.i18n,
    );
    return {
      table: {
        rows: table.tableRows(),
        columns: table.tableColumns(),
      },
      query: customersTransactions.query,
      meta: customersTransactions.meta,
    };
  }
}
