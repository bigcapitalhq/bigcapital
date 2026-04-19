import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '../models/Budget.model';
import { CreateBudgetDto } from '../dtos/CreateBudget.dto';
import { BudgetValidators } from './BudgetValidators.service';
import { IBudgetCreatedPayload } from '../types/Budgets.types';
import { events } from '@/common/events/events';

@Injectable()
export class CreateBudgetService {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly validator: BudgetValidators,
    private readonly eventPublisher: EventEmitter2,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  public createBudget = async (
    budgetDTO: CreateBudgetDto,
    trx?: Knex.Transaction,
  ): Promise<Budget> => {
    this.validator.validateStartDateBeforeEndDate(budgetDTO);
    await this.validator.validateEntriesAccountsExist(budgetDTO);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const budgetObj = {
        name: budgetDTO.name,
        description: budgetDTO.description || null,
        startDate: budgetDTO.startDate,
        endDate: budgetDTO.endDate,
        budgetType: budgetDTO.budgetType,
        periodType: budgetDTO.periodType,
        status: 'draft',
        entries: budgetDTO.entries.map((entry) => ({
          accountId: entry.accountId,
          amount: entry.amount,
          periodDate: entry.periodDate,
        })),
      };

      const budget = await this.budgetModel()
        .query(trx)
        .upsertGraph(budgetObj, { relate: true });

      await this.eventPublisher.emitAsync(events.budgets.onCreated, {
        budget,
        trx,
      } as IBudgetCreatedPayload);

      return budget;
    }, trx);
  };
}
