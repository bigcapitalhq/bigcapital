import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '../models/Budget.model';
import { EditBudgetDto } from '../dtos/CreateBudget.dto';
import { BudgetValidators } from './BudgetValidators.service';
import {
  IBudgetEditingPayload,
  IBudgetEditedPayload,
} from '../types/Budgets.types';
import { events } from '@/common/events/events';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';

@Injectable()
export class EditBudgetService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly validator: BudgetValidators,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  public editBudget = async (
    budgetId: number,
    budgetDTO: EditBudgetDto,
  ): Promise<Budget> => {
    const budget = await this.budgetModel()
      .query()
      .findById(budgetId);

    if (!budget) {
      throw new ServiceError(ERRORS.BUDGET_NOT_FOUND);
    }

    this.validator.validateNotActive(budget);
    this.validator.validateNotClosed(budget);
    this.validator.validateStartDateBeforeEndDate(budgetDTO);
    await this.validator.validateEntriesAccountsExist(budgetDTO);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      await this.eventPublisher.emitAsync(events.budgets.onEditing, {
        budgetId,
        budgetDTO,
        trx,
      } as IBudgetEditingPayload);

      const updatedBudget = await this.budgetModel()
        .query(trx)
        .upsertGraph(
          {
            id: budgetId,
            name: budgetDTO.name,
            description: budgetDTO.description || null,
            startDate: budgetDTO.startDate,
            endDate: budgetDTO.endDate,
            budgetType: budgetDTO.budgetType,
            periodType: budgetDTO.periodType,
            entries: budgetDTO.entries.map((entry) => ({
              accountId: entry.accountId,
              amount: entry.amount,
              periodDate: entry.periodDate,
              ...(entry['id'] ? { id: entry['id'] } : {}),
            })),
          },
          { relate: true, unrelate: true },
        );

      await this.eventPublisher.emitAsync(events.budgets.onEdited, {
        budget: updatedBudget,
        budgetDTO,
        trx,
      } as IBudgetEditedPayload);

      return updatedBudget;
    });
  };
}
