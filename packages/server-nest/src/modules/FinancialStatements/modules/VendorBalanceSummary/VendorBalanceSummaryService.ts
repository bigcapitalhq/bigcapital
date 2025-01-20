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
    this.vendorBalanceSummaryRepository.asyncInit();

    // Report instance.
    const reportInstance = new VendorBalanceSummaryReport(
      this.vendorBalanceSummaryRepository,
      filter,
    );
    // Retrieve the vendor balance summary meta.
    const meta = await this.vendorBalanceSummaryMeta.meta(filter);

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
