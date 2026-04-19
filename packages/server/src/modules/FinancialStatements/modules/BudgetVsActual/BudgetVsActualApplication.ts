import { Injectable } from '@nestjs/common';
import { BudgetVsActualService } from './BudgetVsActualService';
import { IBudgetVsActualQuery } from './BudgetVsActual.types';

@Injectable()
export class BudgetVsActualApplication {
  constructor(private readonly budgetVsActualService: BudgetVsActualService) {}

  public sheet = (query: IBudgetVsActualQuery) => {
    return this.budgetVsActualService.budgetVsActual(query);
  };

  public table = (query: IBudgetVsActualQuery) => {
    return this.budgetVsActualService.budgetVsActual(query);
  };

  public csv = (query: IBudgetVsActualQuery) => {
    return this.budgetVsActualService.budgetVsActual(query);
  };

  public xlsx = (query: IBudgetVsActualQuery) => {
    return this.budgetVsActualService.budgetVsActual(query);
  };

  public pdf = (query: IBudgetVsActualQuery) => {
    return this.budgetVsActualService.budgetVsActual(query);
  };
}
