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
import { BudgetEntry } from '../models/BudgetEntry';
import { EditBudgetDto } from '../dtos/Budget.dto';
import { BudgetTransformer } from '../queries/BudgetTransformer';
import { BudgetValidator } from './BudgetValidator.service';
import {
  IBudgetEditedPayload,
  IBudgetEditingPayload,
} from '../types/Budgets.types';

@Injectable()
export class EditBudgetService {
  constructor(
    private readonly eventPublisher: EventEmitter2,
    private readonly uow: UnitOfWork,
    private readonly validator: BudgetValidator,
    private readonly transformer: TransformerInjectable,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,

    @Inject(BudgetEntry.name)
    private readonly budgetEntryModel: TenantModelProxy<typeof BudgetEntry>,
  ) {}

  /**
   * Transform the edit budget DTO to model.
   * @param {EditBudgetDto} budgetDTO - Budget DTO.
   * @returns {Record<string, any>}
   */
  private transformDTOToModel = (budgetDTO: EditBudgetDto) => {
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
   * Edits the given budget.
   * @param {number} budgetId - Budget id.
   * @param {EditBudgetDto} budgetDTO - Budget DTO.
   * @returns {Promise<ModelObject<Budget>>}
   */
  public editBudget = async (
    budgetId: number,
    budgetDTO: EditBudgetDto,
  ): Promise<ModelObject<Budget>> => {
    // Retrieves the old budget or throws not found error.
    const oldBudget = await this.budgetModel()
      .query()
      .findById(budgetId)
      .throwIfNotFound();

    // Validates the budget date range and entries.
    this.validator.validateDateRange(budgetDTO);
    this.validator.validateEntries(budgetDTO);
    await this.validator.validateAccountsExistance(budgetDTO);

    // Transform the budget DTO to model.
    const budgetObj = this.transformDTOToModel(budgetDTO);

    const budget = await this.uow.withTransaction(
      async (trx: Knex.Transaction) => {
        // Triggers `onBudgetEditing` event.
        await this.eventPublisher.emitAsync(events.budgets.onEditing, {
          editBudgetDTO: budgetDTO,
          oldBudget,
          trx,
        } as IBudgetEditingPayload);

        // Updates the budget attributes.
        await this.budgetModel().query(trx).findById(budgetId).patch({
          name: budgetObj.name,
          description: budgetObj.description,
          fromDate: budgetObj.fromDate,
          toDate: budgetObj.toDate,
        });

        // Replaces the budget entries.
        await this.budgetEntryModel()
          .query(trx)
          .where('budgetId', budgetId)
          .delete();

        if (budgetObj.entries.length > 0) {
          await this.budgetEntryModel()
            .query(trx)
            .insertGraph(
              budgetObj.entries.map((entry) => ({ ...entry, budgetId })),
            );
        }

        // Retrieves the budget with associated entries accounts.
        const budget = await this.budgetModel()
          .query(trx)
          .findById(budgetId)
          .withGraphFetched('entries.account');

        // Triggers `onBudgetEdited` event.
        await this.eventPublisher.emitAsync(events.budgets.onEdited, {
          budget,
          editBudgetDTO: budgetDTO,
          oldBudget,
          trx,
        } as IBudgetEditedPayload);

        return budget;
      },
    );
    return this.transformer.transform(budget, new BudgetTransformer());
  };
}
