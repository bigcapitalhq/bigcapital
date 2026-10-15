import { Inject, Injectable } from '@nestjs/common';
import { TransformerInjectable } from '@/modules/Transformer/TransformerInjectable.service';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '../models/Budget';
import { BudgetTransformer } from './BudgetTransformer';

@Injectable()
export class GetBudget {
  constructor(
    private readonly transformer: TransformerInjectable,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  /**
   * Retrieves the given budget details.
   * @param {number} budgetId - Budget id.
   * @returns {Promise<Budget>}
   */
  public getBudget = async (budgetId: number): Promise<Budget> => {
    const budget = await this.budgetModel()
      .query()
      .findById(budgetId)
      .withGraphFetched('entries.account')
      .throwIfNotFound();

    return this.transformer.transform(budget, new BudgetTransformer());
  };
}
