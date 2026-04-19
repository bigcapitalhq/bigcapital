import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { BudgetsController } from './Budgets.controller';
import { BudgetsApplication } from './BudgetsApplication.service';
import { CreateBudgetService } from './commands/CreateBudget.service';
import { EditBudgetService } from './commands/EditBudget.service';
import { DeleteBudgetService } from './commands/DeleteBudget.service';
import { ActivateBudgetService } from './commands/ActivateBudget.service';
import { CloseBudgetService } from './commands/CloseBudget.service';
import { BulkDeleteBudgetsService } from './commands/BulkDeleteBudgets.service';
import { ValidateBulkDeleteBudgetsService } from './commands/ValidateBulkDeleteBudgets.service';
import { GetBudgetService } from './queries/GetBudget.service';
import { GetBudgetsService } from './queries/GetBudgets.service';
import { BudgetValidators } from './commands/BudgetValidators.service';
import { BudgetRepository } from './repositories/Budget.repository';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';

@Module({
  imports: [TenancyDatabaseModule, DynamicListModule],
  controllers: [BudgetsController],
  providers: [
    BudgetsApplication,
    CreateBudgetService,
    EditBudgetService,
    DeleteBudgetService,
    ActivateBudgetService,
    CloseBudgetService,
    BulkDeleteBudgetsService,
    ValidateBulkDeleteBudgetsService,
    GetBudgetService,
    GetBudgetsService,
    BudgetValidators,
    BudgetRepository,
    TransformerInjectable,
  ],
  exports: [BudgetRepository],
})
export class BudgetsModule {}
