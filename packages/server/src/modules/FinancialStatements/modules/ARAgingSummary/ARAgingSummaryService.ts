import { ARAgingSummarySheet } from './ARAgingSummarySheet';
import { ARAgingSummaryMeta } from './ARAgingSummaryMeta';
import { getARAgingSummaryDefaultQuery } from './utils';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IARAgingSummaryQuery } from './ARAgingSummary.types';
import { events } from '@/common/events/events';
import { ARAgingSummaryRepository } from './ARAgingSummaryRepository';

@Injectable()
export class ARAgingSummaryService {
  constructor(
    private readonly ARAgingSummaryMeta: ARAgingSummaryMeta,
    private readonly ARAgingSummaryRepository: ARAgingSummaryRepository,
    private readonly eventPublisher: EventEmitter2,
  ) {}

  /**
   * Retrieve A/R aging summary report.
   * @param {IARAgingSummaryQuery} query -
   */
  async ARAgingSummary(query: IARAgingSummaryQuery) {
    const filter = {
      ...getARAgingSummaryDefaultQuery(),
      ...query,
    };
    // Load the A/R aging summary repository.
    this.ARAgingSummaryRepository.setFilter(filter);
    await this.ARAgingSummaryRepository.load();

    // AR aging summary report instance.
    const ARAgingSummaryReport = new ARAgingSummarySheet(
      filter,
      this.ARAgingSummaryRepository,
    );
    // AR aging summary report data and columns.
    const data = ARAgingSummaryReport.reportData();
    const columns = ARAgingSummaryReport.reportColumns();

    // Retrieve the aging summary report meta.
    const meta = await this.ARAgingSummaryMeta.meta(filter);

    // Triggers `onReceivableAgingViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onReceivableAgingViewed,
      { query },
    );

    return {
      data,
      columns,
      query: filter,
      meta,
    };
  }
}
