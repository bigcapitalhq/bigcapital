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
import { pipe } from 'fp-ts/function';
import { I18nService } from 'nestjs-i18n';
import { AccountingBasisService } from '../../common/AccountingBasisService';
import { normalizeComparisonQuery } from '../../common/normalizeComparisonQuery';

@Injectable()
export class ProfitLossSheetService {
  constructor(
    private readonly profitLossSheetMeta: ProfitLossSheetMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly i18nService: I18nService,
    private readonly profitLossRepository: ProfitLossSheetRepository,
    private readonly accountingBasisService: AccountingBasisService,
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
    const filter = await pipe(
      query,
      mergeQueryWithDefaults,
      normalizeComparisonQuery,
      (normalizedQuery) =>
        this.accountingBasisService.resolveQuery(normalizedQuery),
    );

    // Loads the profit/loss sheet data.
    await this.profitLossRepository.asyncInitialize(filter);

    // Retrieve the profit/loss sheet meta first to get date format.
    const meta = await this.profitLossSheetMeta.meta(filter);

    // Profit/Loss report instance.
    const profitLossInstance = new ProfitLossSheet(
      this.profitLossRepository,
      filter,
      this.i18nService,
      { baseCurrency: meta.baseCurrency, dateFormat: meta.dateFormat },
    );
    // Profit/loss report data and columns.
    const data = profitLossInstance.reportData();

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
