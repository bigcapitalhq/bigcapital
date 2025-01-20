import { I18nService } from 'nestjs-i18n';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersStatement,
} from './TransactionsByCustomer.types';
import { TransactionsByCustomersRepository } from './TransactionsByCustomersRepository';
import { TransactionsByCustomersMeta } from './TransactionsByCustomersMeta';
import { getTransactionsByCustomerDefaultQuery } from './utils';
import { TransactionsByCustomers } from './TransactionsByCustomers';
import { events } from '@/common/events/events';

@Injectable()
export class TransactionsByCustomersSheet {
  constructor(
    private readonly transactionsByCustomersMeta: TransactionsByCustomersMeta,
    private readonly transactionsByCustomersRepository: TransactionsByCustomersRepository,
    private readonly eventPublisher: EventEmitter2,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve transactions by by the customers.
   * @param {number} tenantId
   * @param {ITransactionsByCustomersFilter} query
   * @return {Promise<ITransactionsByCustomersStatement>}
   */
  public async transactionsByCustomers(
    query: ITransactionsByCustomersFilter,
  ): Promise<ITransactionsByCustomersStatement> {
    const filter = {
      ...getTransactionsByCustomerDefaultQuery(),
      ...query,
    };
    this.transactionsByCustomersRepository.setFilter(filter);
    await this.transactionsByCustomersRepository.asyncInit();

    // Transactions by customers data mapper.
    const reportInstance = new TransactionsByCustomers(
      filter,
      this.transactionsByCustomersRepository,
      this.i18n,
    );
    const meta = await this.transactionsByCustomersMeta.meta(filter);

    // Triggers `onCustomerTransactionsViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onCustomerTransactionsViewed,
      { query },
    );

    return {
      data: reportInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
