import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { Knex } from 'knex';
import { ModelObject } from 'objection';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { events } from '@/common/events/events';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { Budget } from '../models/Budget';
import { CreateBudgetDto } from '../dtos/Budget.dto';
import { BudgetTransformer } from '../queries/BudgetTransformer';
import { BudgetValidator } from './BudgetValidator.service';
import {
  IBudgetCreatedPayload,
  IBudgetCreatingPayload,
} from '../types/Budgets.types';

@Injectable()
export class CreateBudgetService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validator: BudgetValidator,
    private readonly transformer: TransformerInjectable,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  /**
   * Transform the create budget DTO to upsert graph operation.
   * @param {CreateBudgetDto} budgetDTO - Budget DTO.
   * @returns {Record<string, any>}
   */
  private transformDTOToModel = (budgetDTO: CreateBudgetDto) => {
    return {
      name: budgetDTO.name,
      description: budgetDTO.description ?? '',
      fromDate: moment(budgetDTO.fromDate)
        .startOf('month')
        .format('YYYY-MM-DD'),
      toDate: moment(budgetDTO.toDate).endOf('month').format('YYYY-MM-DD'),
      entries: budgetDTO.entries.map((entry) => ({
        accountId: entry.accountId,
        date: moment(entry.date).startOf('month').format('YYYY-MM-DD'),
        amount: entry.amount,
      })),
    };
  };

  /**
   * Creates a new budget.
   * @param {CreateBudgetDto} budgetDTO - Budget DTO.
   * @returns {Promise<ModelObject<Budget>>}
   */
  public createBudget = async (
    budgetDTO: CreateBudgetDto,
  ): Promise<ModelObject<Budget>> => {
    // Validates the budget date range and entries.
    this.validator.validateDateRange(budgetDTO);
    this.validator.validateEntries(budgetDTO);
    await this.validator.validateAccountsExistance(budgetDTO);

    // Transform the budget DTO to model.
    const budgetObj = this.transformDTOToModel(budgetDTO);

    const budget = await this.uow.withTransaction(
      async (trx: Knex.Transaction) => {
        // Triggers `onBudgetCreating` event.
        await this.eventPublisher.emitAsync(events.budgets.onCreating, {
          createBudgetDTO: budgetDTO,
          trx,
        } as IBudgetCreatingPayload);

        // Inserts the budget with associated entries.
        const insertedBudget = await this.budgetModel()
          .query(trx)
          .insertGraph(budgetObj);

        // Retrieves the budget with associated entries accounts.
        const budget = await this.budgetModel()
          .query(trx)
          .findById(insertedBudget.id)
          .withGraphFetched('entries.account');

        // Triggers `onBudgetCreated` event.
        await this.eventPublisher.emitAsync(events.budgets.onCreated, {
          budget,
          createBudgetDTO: budgetDTO,
          trx,
        } as IBudgetCreatedPayload);

        return budget;
      },
    );
    return this.transformer.transform(budget, new BudgetTransformer());
  };
}
