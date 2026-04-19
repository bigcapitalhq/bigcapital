import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '../models/Budget.model';
import { BudgetValidators } from './BudgetValidators.service';
import {
  IBudgetActivatingPayload,
  IBudgetActivatedPayload,
} from '../types/Budgets.types';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';

@Injectable()
export class ActivateBudgetService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly validator: BudgetValidators,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  public activateBudget = async (budgetId: number): Promise<Budget> => {
    const budget = await this.budgetModel()
      .query()
      .findById(budgetId);

    if (!budget) {
      throw new ServiceError(ERRORS.BUDGET_NOT_FOUND);
    }

    this.validator.validateCanActivate(budget);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.eventPublisher.emitAsync(events.budgets.onActivating, {
        budgetId,
        trx,
      } as IBudgetActivatingPayload);

      const updatedBudget = await this.budgetModel()
        .query(trx)
        .patchAndFetchById(budgetId, {
          status: 'active',
        });

      await this.eventPublisher.emitAsync(events.budgets.onActivated, {
        budget: updatedBudget,
        trx,
      } as IBudgetActivatedPayload);

      return updatedBudget;
    });
  };
}
