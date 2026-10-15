import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { I18nService } from 'nestjs-i18n';
import { events } from '@/common/events/events';
import { BudgetVsActual } from './BudgetVsActual';
import { BudgetVsActualMeta } from './BudgetVsActualMeta';
import { BudgetVsActualRepository } from './BudgetVsActualRepository';
import { mergeQueryWithDefaults } from './utils';
import {
  IBudgetVsActualQuery,
  IBudgetVsActualResponse,
} from './BudgetVsActual.types';

@Injectable()
export class BudgetVsActualService {
  constructor(
    private readonly repository: BudgetVsActualRepository,
    private readonly budgetVsActualMeta: BudgetVsActualMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly i18n: I18nService,
  ) {}

  /**
   * Retrieves the budget vs actual report.
   * @param {IBudgetVsActualQuery} query - The report query.
   * @returns {Promise<IBudgetVsActualResponse>}
   */
  public budgetVsActual = async (
    query: IBudgetVsActualQuery,
  ): Promise<IBudgetVsActualResponse> => {
    // Merges the given query with default query.
    const filter = mergeQueryWithDefaults(query);

    // Loads the report data.
    this.repository.setFilter(filter);
    await this.repository.asyncInitialize();

    // The normalized query after applying the budget defaults.
    const normalizedQuery = this.repository.query;

    // Retrieve the report meta.
    const meta = await this.budgetVsActualMeta.meta(
      this.repository.budget,
      normalizedQuery,
    );
    // Report instance.
    const reportInstance = new BudgetVsActual(
      this.repository,
      normalizedQuery,
      this.i18n,
      { baseCurrency: meta.baseCurrency, dateFormat: meta.dateFormat },
    );
    // Report data.
    const data = reportInstance.reportData();

    // Triggers `onBudgetVsActualViewed` event.
    await this.eventPublisher.emitAsync(events.reports.onBudgetVsActualViewed, {
      query,
    });

    return {
      data,
      query: normalizedQuery,
      meta,
    };
  };
}
