import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  IVendorBalanceSummaryQuery,
  IVendorBalanceSummaryStatement,
} from './VendorBalanceSummary.types';
import { VendorBalanceSummaryReport } from './VendorBalanceSummary';
import { VendorBalanceSummaryRepository } from './VendorBalanceSummaryRepository';
import { VendorBalanceSummaryMeta } from './VendorBalanceSummaryMeta';
import { getVendorBalanceSummaryDefaultQuery } from './utils';
import { events } from '@/common/events/events';

@Injectable()
export class VendorBalanceSummaryService {
  constructor(
    private readonly vendorBalanceSummaryRepository: VendorBalanceSummaryRepository,
    private readonly vendorBalanceSummaryMeta: VendorBalanceSummaryMeta,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * Retrieve the statment of customer balance summary report.
   * @param {IVendorBalanceSummaryQuery} query -
   * @return {Promise<IVendorBalanceSummaryStatement>}
   */
  public async vendorBalanceSummary(
    query: IVendorBalanceSummaryQuery,
  ): Promise<IVendorBalanceSummaryStatement> {
    const filter = { ...getVendorBalanceSummaryDefaultQuery(), ...query };

    this.vendorBalanceSummaryRepository.setFilter(filter);
    await this.vendorBalanceSummaryRepository.asyncInit();

    // Retrieve the vendor balance summary meta first to get date format.
    const meta = await this.vendorBalanceSummaryMeta.meta(filter);

    // Report instance.
    const reportInstance = new VendorBalanceSummaryReport(
      this.vendorBalanceSummaryRepository,
      filter,
      {
        baseCurrency: this.vendorBalanceSummaryRepository.baseCurrency,
        dateFormat: meta.dateFormat,
      },
    );

    // Triggers `onVendorBalanceSummaryViewed` event.
    await this.eventEmitter.emitAsync(
      events.reports.onVendorBalanceSummaryViewed,
      { query },
    );
    return {
      data: reportInstance.reportData(),
      query: filter,
      meta,
    };
  }
}
