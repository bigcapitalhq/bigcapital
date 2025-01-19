import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ITransactionsByVendorsFilter,
  ITransactionsByVendorsStatement,
} from './TransactionsByVendor.types';
import { TransactionsByVendor } from './TransactionsByVendor';
import { TransactionsByVendorRepository } from './TransactionsByVendorRepository';
import { TransactionsByVendorMeta } from './TransactionsByVendorMeta';
import { getTransactionsByVendorDefaultQuery } from './utils';
import { events } from '@/common/events/events';

@Injectable()
export class TransactionsByVendorsInjectable {
  constructor(
    private readonly transactionsByVendorRepository: TransactionsByVendorRepository,
    private readonly transactionsByVendorMeta: TransactionsByVendorMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieve transactions by by the customers.
   * @param {ITransactionsByVendorsFilter} query - Transactions by vendors filter.
   * @return {Promise<ITransactionsByVendorsStatement>}
   */
  public async transactionsByVendors(
    query: ITransactionsByVendorsFilter,
  ): Promise<ITransactionsByVendorsStatement> {
    const filter = { ...getTransactionsByVendorDefaultQuery(), ...query };

    // Transactions by customers data mapper.
    const reportInstance = new TransactionsByVendor(
      this.transactionsByVendorRepository,
      filter,
      this.i18n,
    );
    const meta = await this.transactionsByVendorMeta.meta(filter);

    // Triggers `onVendorTransactionsViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onVendorTransactionsViewed,
      { query },
    );

    return {
      data: reportInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
