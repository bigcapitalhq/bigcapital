import {
  ITransactionsByCustomersFilter,
  ITransactionsByCustomersStatement,
} from './TransactionsByCustomer.types';
import { TransactionsByCustomersRepository } from './TransactionsByCustomersRepository';
import { TransactionsByCustomersMeta } from './TransactionsByCustomersMeta';
import { getTransactionsByCustomerDefaultQuery } from './utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TransactionsByCustomers } from './TransactionsByCustomers';
import { events } from '@/common/events/events';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionsByCustomersSheet {
  constructor(
    private readonly transactionsByCustomersMeta: TransactionsByCustomersMeta,
    private readonly transactionsByCustomersRepository: TransactionsByCustomersRepository,
    private readonly eventPublisher: EventEmitter2,
    private readonly tenancyContext: TenancyContext,
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
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

    const filter = {
      ...getTransactionsByCustomerDefaultQuery(),
      ...query,
    };
    await this.transactionsByCustomersRepository.asyncInit(filter);

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
      {
        query,
      },
    );

    return {
      data: reportInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
