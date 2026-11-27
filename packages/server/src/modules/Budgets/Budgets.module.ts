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
import { GetBudgetPrefill } from './queries/GetBudgetPrefill.service';
import { BudgetsApplication } from './BudgetsApplication.service';
import { BudgetsController } from './Budgets.controller';
import { BudgetsFeatureGuard } from './BudgetsFeatureGuard';
import { FeaturesModule } from '../Features/Features.module';

const models = [
  RegisterTenancyModel(Budget),
  RegisterTenancyModel(BudgetEntry),
];

@Module({
  controllers: [BudgetsController],
  imports: [DynamicListModule, FeaturesModule, ...models],
  providers: [
    BudgetValidator,
    CreateBudgetService,
    EditBudgetService,
    DeleteBudgetService,
    GetBudget,
    GetBudgets,
    GetBudgetPrefill,
    BudgetsApplication,
    BudgetsFeatureGuard,
  ],
  exports: [...models],
})
export class BudgetsModule {}
