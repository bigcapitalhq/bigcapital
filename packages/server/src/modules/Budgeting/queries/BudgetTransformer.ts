import { Transformer } from '@/modules/Transformer/Transformer';
import { Budget } from '../models/Budget.model';

export class BudgetTransformer extends Transformer {
  public includeAttributes = (): string[] => {
    return [
      'formattedStartDate',
      'formattedEndDate',
      'formattedCreatedAt',
    ];
  };

  protected formattedStartDate = (budget: Budget): string => {
    return this.formatDate(budget.startDate);
  };

  protected formattedEndDate = (budget: Budget): string => {
    return this.formatDate(budget.endDate);
  };

  protected formattedCreatedAt = (budget: Budget): string => {
    return this.formatDate(budget.createdAt);
  };
}
