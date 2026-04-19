import { Inject, Injectable } from '@nestjs/common';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { Budget } from '../models/Budget.model';
import { BudgetValidators } from './BudgetValidators.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { ERRORS } from '../constants';

@Injectable()
export class BulkDeleteBudgetsService {
  constructor(
    private readonly validator: BudgetValidators,

    @Inject(Budget.name)
    private readonly budgetModel: TenantModelProxy<typeof Budget>,
  ) {}

  public bulkDeleteBudgets = async (
    budgetIds: number[],
    options?: { skipUndeletable?: boolean },
  ): Promise<void> => {
    const budgets = await this.budgetModel()
      .query()
      .whereIn('id', budgetIds);

    const deletableBudgets = budgets.filter((budget) => {
      try {
        this.validator.validateCanDelete(budget);
        return true;
      } catch {
        return false;
      }
    });

    const deletableIds = deletableBudgets.map((b) => b.id);

    if (!options?.skipUndeletable && deletableIds.length < budgetIds.length) {
      throw new ServiceError(ERRORS.BUDGET_ACTIVE_CANNOT_DELETE);
    }

    await this.budgetModel()
      .query()
      .whereIn('id', deletableIds)
      .delete();
  };
}
