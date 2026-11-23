import { Injectable } from '@nestjs/common';
import { CreateBudgetService } from './commands/CreateBudget.service';
import { EditBudgetService } from './commands/EditBudget.service';
import { DeleteBudgetService } from './commands/DeleteBudget.service';
import { GetBudget } from './queries/GetBudget.service';
import { GetBudgets } from './queries/GetBudgets.service';
import { CreateBudgetDto, EditBudgetDto } from './dtos/Budget.dto';
import { GetBudgetsQueryDto } from './dtos/GetBudgetsQuery.dto';

@Injectable()
export class BudgetsApplication {
  constructor(
    private readonly createBudgetService: CreateBudgetService,
    private readonly editBudgetService: EditBudgetService,
    private readonly deleteBudgetService: DeleteBudgetService,
    private readonly getBudgetService: GetBudget,
    private readonly getBudgetsService: GetBudgets,
  ) {}

  /**
   * Creates a new budget.
   * @param {CreateBudgetDto} budgetDTO - Budget DTO.
   */
  public createBudget = (budgetDTO: CreateBudgetDto) => {
    return this.createBudgetService.createBudget(budgetDTO);
  };

  /**
   * Edits the given budget.
   * @param {number} budgetId - Budget id.
   * @param {EditBudgetDto} budgetDTO - Budget DTO.
   */
  public editBudget = (budgetId: number, budgetDTO: EditBudgetDto) => {
    return this.editBudgetService.editBudget(budgetId, budgetDTO);
  };

  /**
   * Deletes the given budget.
   * @param {number} budgetId - Budget id.
   */
  public deleteBudget = (budgetId: number) => {
    return this.deleteBudgetService.deleteBudget(budgetId);
  };

  /**
   * Retrieves the given budget details.
   * @param {number} budgetId - Budget id.
   */
  public getBudget = (budgetId: number) => {
    return this.getBudgetService.getBudget(budgetId);
  };

  /**
   * Retrieves the budgets paginated list.
   * @param {GetBudgetsQueryDto} filterDTO - Filter DTO.
   */
  public getBudgets = (filterDTO: GetBudgetsQueryDto) => {
    return this.getBudgetsService.getBudgets(filterDTO);
  };
}
