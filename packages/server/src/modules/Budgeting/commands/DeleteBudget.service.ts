import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '../models/Budget.model';
import { BudgetValidators } from './BudgetValidators.service';
import {
  IBudgetDeletingPayload,
  IBudgetDeletedPayload,
} from '../types/Budgets.types';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';

@Injectable()
export class DeleteBudgetService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly validator: BudgetValidators,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  public deleteBudget = async (budgetId: number): Promise<void> => {
    const budget = await this.budgetModel()
      .query()
      .findById(budgetId);

    if (!budget) {
      throw new ServiceError(ERRORS.BUDGET_NOT_FOUND);
    }

    this.validator.validateCanDelete(budget);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.eventPublisher.emitAsync(events.budgets.onDeleting, {
        budgetId,
        trx,
      } as IBudgetDeletingPayload);

      await this.budgetModel().query(trx).findById(budgetId).delete();

      await this.eventPublisher.emitAsync(events.budgets.onDeleted, {
        budgetId,
        trx,
      } as IBudgetDeletedPayload);
    });
  };
}
