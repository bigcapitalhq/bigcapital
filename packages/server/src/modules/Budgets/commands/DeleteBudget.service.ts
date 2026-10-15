import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '../models/Budget';
import { BudgetEntry } from '../models/BudgetEntry';
import {
  IBudgetDeletedPayload,
  IBudgetDeletingPayload,
} from '../types/Budgets.types';

@Injectable()
export class DeleteBudgetService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,

    @Inject(BudgetEntry.name)
    private readonly budgetEntryModel: TenantModelProxy<typeof BudgetEntry>,
  ) {}

  /**
   * Deletes the given budget.
   * @param {number} budgetId - Budget id.
   * @returns {Promise<{ oldBudget: Budget }>}
   */
  public deleteBudget = async (
    budgetId: number,
  ): Promise<{ oldBudget: Budget }> => {
    // Retrieves the old budget or throws not found error.
    const oldBudget = await this.budgetModel()
      .query()
      .findById(budgetId)
      .throwIfNotFound();

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBudgetDeleting` event.
      await this.eventPublisher.emitAsync(events.budgets.onDeleting, {
        oldBudget,
        trx,
      } as IBudgetDeletingPayload);

      // Deletes the budget entries.
      await this.budgetEntryModel()
        .query(trx)
        .where('budgetId', budgetId)
        .delete();

      // Deletes the budget.
      await this.budgetModel().query(trx).findById(budgetId).delete();

      // Triggers `onBudgetDeleted` event.
      await this.eventPublisher.emitAsync(events.budgets.onDeleted, {
        budgetId,
        oldBudget,
        trx,
      } as IBudgetDeletedPayload);

      return { oldBudget };
    });
  };
}
