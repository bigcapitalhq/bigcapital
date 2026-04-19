import { Injectable } from '@nestjs/common';
import { CreateBudgetService } from './commands/CreateBudget.service';
import { EditBudgetService } from './commands/EditBudget.service';
import { DeleteBudgetService } from './commands/DeleteBudget.service';
import { ActivateBudgetService } from './commands/ActivateBudget.service';
import { CloseBudgetService } from './commands/CloseBudget.service';
import { BulkDeleteBudgetsService } from './commands/BulkDeleteBudgets.service';
import { ValidateBulkDeleteBudgetsService } from './commands/ValidateBulkDeleteBudgets.service';
import { GetBudgetService } from './queries/GetBudget.service';
import { GetBudgetsService } from './queries/GetBudgets.service';
import { CreateBudgetDto, EditBudgetDto } from './dtos/CreateBudget.dto';
import { GetBudgetsQueryDto } from './dtos/GetBudgetsQuery.dto';
import { Budget } from './models/Budget.model';

@Injectable()
export class BudgetsApplication {
  constructor(
    private createBudgetService: CreateBudgetService,
    private editBudgetService: EditBudgetService,
    private deleteBudgetService: DeleteBudgetService,
    private activateBudgetService: ActivateBudgetService,
    private closeBudgetService: CloseBudgetService,
    private getBudgetService: GetBudgetService,
    private getBudgetsService: GetBudgetsService,
    private bulkDeleteBudgetsService: BulkDeleteBudgetsService,
    private validateBulkDeleteBudgetsService: ValidateBulkDeleteBudgetsService,
  ) {}

  public createBudget = (budgetDTO: CreateBudgetDto): Promise<Budget> => {
    return this.createBudgetService.createBudget(budgetDTO);
  };

  public editBudget = (
    budgetId: number,
    budgetDTO: EditBudgetDto,
  ): Promise<Budget> => {
    return this.editBudgetService.editBudget(budgetId, budgetDTO);
  };

  public deleteBudget = (budgetId: number): Promise<void> => {
    return this.deleteBudgetService.deleteBudget(budgetId);
  };

  public activateBudget = (budgetId: number): Promise<Budget> => {
    return this.activateBudgetService.activateBudget(budgetId);
  };

  public closeBudget = (budgetId: number): Promise<Budget> => {
    return this.closeBudgetService.closeBudget(budgetId);
  };

  public getBudget = (budgetId: number): Promise<Budget> => {
    return this.getBudgetService.getBudget(budgetId);
  };

  public getBudgets = (filterDTO: GetBudgetsQueryDto) => {
    return this.getBudgetsService.getBudgets(filterDTO);
  };

  public bulkDeleteBudgets = (
    budgetIds: number[],
    options?: { skipUndeletable?: boolean },
  ) => {
    return this.bulkDeleteBudgetsService.bulkDeleteBudgets(
      budgetIds,
      options,
    );
  };

  public validateBulkDeleteBudgets = (budgetIds: number[]) => {
    return this.validateBulkDeleteBudgetsService.validateBulkDeleteBudgets(
      budgetIds,
    );
  };
}
