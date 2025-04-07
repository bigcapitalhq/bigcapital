import {
  IProfitLossSheetQuery,
  IProfitLossSheetMeta,
  IProfitLossSheetNode,
} from './ProfitLossSheet.types';
import ProfitLossSheet from './ProfitLossSheet';
import { mergeQueryWithDefaults } from './utils';
import { ProfitLossSheetRepository } from './ProfitLossSheetRepository';
import { ProfitLossSheetMeta } from './ProfitLossSheetMeta';
import { events } from '@/common/events/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class ProfitLossSheetService {
  constructor(
    private readonly profitLossSheetMeta: ProfitLossSheetMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly i18nService: I18nService,
    private readonly profitLossRepository: ProfitLossSheetRepository,
  ) {}

  /**
   * Retrieve profit/loss sheet statement.
   * @param {IProfitLossSheetQuery} query
   * @return { }
   */
  public profitLossSheet = async (
    query: IProfitLossSheetQuery,
  ): Promise<{
    data: IProfitLossSheetNode[];
    query: IProfitLossSheetQuery;
    meta: IProfitLossSheetMeta;
  }> => {
    // Merges the given query with default filter query.
    const filter = mergeQueryWithDefaults(query);

    // Loads the profit/loss sheet data.
    this.profitLossRepository.setFilter(filter);
    await this.profitLossRepository.asyncInitialize();

    // Profit/Loss report instance.
    const profitLossInstance = new ProfitLossSheet(
      this.profitLossRepository,
      filter,
      this.i18nService,
    );
    // Profit/loss report data and columns.
    const data = profitLossInstance.reportData();

    // Retrieve the profit/loss sheet meta.
    const meta = await this.profitLossSheetMeta.meta(filter);

    // Triggers `onProfitLossSheetViewed` event.
    await this.eventPublisher.emitAsync(
      events.reports.onProfitLossSheetViewed,
      { query },
    );

    return {
      query: filter,
      data,
      meta,
    };
  };
}
