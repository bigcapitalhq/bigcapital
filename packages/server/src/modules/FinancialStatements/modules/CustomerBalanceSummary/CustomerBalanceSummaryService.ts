import * as R from 'ramda';
import {
  ICustomerBalanceSummaryQuery,
  ICustomerBalanceSummaryStatement,
} from './CustomerBalanceSummary.types';
import { CustomerBalanceSummaryReport } from './CustomerBalanceSummary';
import { CustomerBalanceSummaryRepository } from './CustomerBalanceSummaryRepository';
import { CustomerBalanceSummaryMeta } from './CustomerBalanceSummaryMeta';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ILedgerEntry } from '@/modules/Ledger/types/Ledger.types';
import { Ledger } from '@/modules/Ledger/Ledger';
import { events } from '@/common/events/events';
import { getCustomerBalanceSummaryDefaultQuery } from './_utils';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Injectable()
export class CustomerBalanceSummaryService {
  constructor(
    private readonly reportRepository: CustomerBalanceSummaryRepository,
    private readonly customerBalanceSummaryMeta: CustomerBalanceSummaryMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly tenancyContext: TenancyContext,
  ) {}

  /**
   * Retrieve the customers ledger entries mapped from accounts transactions.
   * @param {Date|string} asDate - The date to retrieve the ledger entries.
   * @returns {Promise<ILedgerEntry[]>}
   */
  private async getReportCustomersEntries(
    asDate: Date | string,
  ): Promise<ILedgerEntry[]> {
    const transactions =
      await this.reportRepository.getCustomersTransactions(asDate);
    const commonProps = { accountNormal: 'debit', date: asDate };

    // @ts-ignore
    return R.map(R.mergeRight(commonProps))(transactions);
  }

  /**
   * Retrieve the statment of customer balance summary report.
   * @param {ICustomerBalanceSummaryQuery} query - The customer balance summary query.
   * @return {Promise<ICustomerBalanceSummaryStatement>}
   */
  public async customerBalanceSummary(
    query: ICustomerBalanceSummaryQuery,
  ): Promise<ICustomerBalanceSummaryStatement> {
    const tenantMetadata = await this.tenancyContext.getTenantMetadata();

    // Merges the default query and request query.
    const filter = { ...getCustomerBalanceSummaryDefaultQuery(), ...query };

    // Retrieve the customers list ordered by the display name.
    const customers = await this.reportRepository.getCustomers(
      query.customersIds,
    );
    // Retrieve the customers debit/credit totals.
    const customersEntries = await this.getReportCustomersEntries(
      filter.asDate,
    );
    // Ledger query.
    const ledger = new Ledger(customersEntries);

    // Report instance.
    const report = new CustomerBalanceSummaryReport(
      ledger,
      customers,
      filter,
      tenantMetadata.baseCurrency,
    );
    // Retrieve the customer balance summary meta.
    const meta = await this.customerBalanceSummaryMeta.meta(filter);

    // Triggers `onCustomerBalanceSummaryViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onCustomerBalanceSummaryViewed,
      {
        query,
      },
    );

    return {
      data: report.reportData(),
      query: filter,
      meta,
    };
  }
}
