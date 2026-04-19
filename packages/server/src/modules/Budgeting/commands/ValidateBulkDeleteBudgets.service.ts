import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '../models/Budget.model';
import { BudgetValidators } from './BudgetValidators.service';

@Injectable()
export class ValidateBulkDeleteBudgetsService {
  constructor(
    private readonly validator: BudgetValidators,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  public validateBulkDeleteBudgets = async (budgetIds: number[]) => {
    const budgets = await this.budgetModel()
      .query()
      .whereIn('id', budgetIds);

    const deletableIds: number[] = [];
    const nonDeletableIds: number[] = [];

    budgets.forEach((budget) => {
      try {
        this.validator.validateCanDelete(budget);
        deletableIds.push(budget.id);
      } catch {
        nonDeletableIds.push(budget.id);
      }
    });

    return {
      deletableIds,
      nonDeletableIds,
      deletableCount: deletableIds.length,
      nonDeletableCount: nonDeletableIds.length,
    };
  };
}
