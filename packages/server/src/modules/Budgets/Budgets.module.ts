import { Module } from '@nestjs/common';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { Budget } from './models/Budget';
import { BudgetEntry } from './models/BudgetEntry';
import { BudgetValidator } from './commands/BudgetValidator.service';
import { CreateBudgetService } from './commands/CreateBudget.service';
import { EditBudgetService } from './commands/EditBudget.service';
import { DeleteBudgetService } from './commands/DeleteBudget.service';
import { GetBudget } from './queries/GetBudget.service';
import { GetBudgets } from './queries/GetBudgets.service';
import { BudgetsApplication } from './BudgetsApplication.service';
import { BudgetsController } from './Budgets.controller';

const models = [
  RegisterTenancyModel(Budget),
  RegisterTenancyModel(BudgetEntry),
];

@Module({
  controllers: [BudgetsController],
  imports: [DynamicListModule, ...models],
  providers: [
    BudgetValidator,
    CreateBudgetService,
    EditBudgetService,
    DeleteBudgetService,
    GetBudget,
    GetBudgets,
    BudgetsApplication,
  ],
  exports: [...models],
})
export class BudgetsModule {}
