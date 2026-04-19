import {
  IBudgetVsActualQuery,
  IBudgetVsActualMeta,
  IBudgetVsActualNode,
} from './BudgetVsActual.types';
import { BudgetVsActualSheet } from './BudgetVsActual';
import { mergeQueryWithDefaults } from './utils';
import { BudgetVsActualRepository } from './BudgetVsActualRepository';
import { BudgetVsActualMeta } from './BudgetVsActualMeta';
import { events } from '@/common/events/events';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '@/modules/Budgeting/constants';

@Injectable()
export class BudgetVsActualService {
  constructor(
    private readonly budgetVsActualMeta: BudgetVsActualMeta,
    private readonly eventPublisher: EventEmitter2,
    private readonly i18nService: I18nService,
    private readonly budgetVsActualRepository: BudgetVsActualRepository,
  ) {}

  public budgetVsActual = async (
    query: IBudgetVsActualQuery,
  ): Promise<{
    data: IBudgetVsActualNode[];
    query: IBudgetVsActualQuery;
    meta: IBudgetVsActualMeta;
  }> => {
    const filter = mergeQueryWithDefaults(query);

    this.budgetVsActualRepository.setFilter(filter);
    await this.budgetVsActualRepository.asyncInitialize();

    if (!this.budgetVsActualRepository.budget) {
      throw new ServiceError(ERRORS.BUDGET_NOT_FOUND);
    }

    const meta = await this.budgetVsActualMeta.meta(
      filter,
      this.budgetVsActualRepository.budget,
    );

    const budgetVsActualInstance = new BudgetVsActualSheet(
      this.budgetVsActualRepository,
      filter,
      this.i18nService,
      { baseCurrency: meta.baseCurrency, dateFormat: meta.dateFormat },
    );

    const data = budgetVsActualInstance.reportData();

    await this.eventPublisher.emitAsync(
      events.reports.onBudgetVsActualViewed,
      { query: filter },
    );

    return {
      query: filter,
      data,
      meta,
    };
  };
}
