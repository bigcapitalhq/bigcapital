import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import {
  IAPAgingSummaryQuery,
  IAPAgingSummarySheet,
} from './APAgingSummary.types';
import { APAgingSummarySheet } from './APAgingSummarySheet';
import { APAgingSummaryMeta } from './APAgingSummaryMeta';
import { getAPAgingSummaryDefaultQuery } from './utils';
import { events } from '@/common/events/events';

@Injectable()
export class APAgingSummaryService {
  constructor(
    private readonly APAgingSummaryMeta: APAgingSummaryMeta,
    private readonly eventPublisher: EventEmitter2,
  ) {}

  /**
   * Retrieve A/P aging summary report.
   * @param {number} tenantId -
   * @param {IAPAgingSummaryQuery} query -
   * @returns {Promise<IAPAgingSummarySheet>}
   */
  public async APAgingSummary(
    query: IAPAgingSummaryQuery,
  ): Promise<IAPAgingSummarySheet> {

    const filter = {
      ...getAPAgingSummaryDefaultQuery(),
      ...query,
    };
    // A/P aging summary report instance.
    const APAgingSummaryReport = new APAgingSummarySheet(
      filter,
      vendors,
      overdueBills,
      dueBills,
      tenant.metadata.baseCurrency,
    );
    // A/P aging summary report data and columns.
    const data = APAgingSummaryReport.reportData();
    const columns = APAgingSummaryReport.reportColumns();

    // Retrieve the aging summary report meta.
    const meta = await this.APAgingSummaryMeta.meta(filter);

    // Triggers `onPayableAgingViewed` event.
    await this.eventPublisher.emitAsync(events.reports.onPayableAgingViewed, {
      query,
    });

    return {
      data,
      columns,
      query: filter,
      meta,
    };
  }
}
