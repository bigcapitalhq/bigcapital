import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '../models/Budget.model';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';

@Injectable()
export class GetBudgetService {
  constructor(
    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  public getBudget = async (budgetId: number): Promise<Budget> => {
    const budget = await this.budgetModel()
      .query()
      .findById(budgetId)
      .withGraphFetched('entries.account');

    if (!budget) {
      throw new ServiceError(ERRORS.BUDGET_NOT_FOUND);
    }

    return budget;
  };
}
