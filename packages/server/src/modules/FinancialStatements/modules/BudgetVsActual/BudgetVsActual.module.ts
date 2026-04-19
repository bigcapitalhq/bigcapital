import { Module } from '@nestjs/common';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { AccountsModule } from '@/modules/Accounts/Accounts.module';
import { BudgetsModule } from '@/modules/Budgeting/Budgets.module';
import { BudgetVsActualController } from './BudgetVsActual.controller';
import { BudgetVsActualApplication } from './BudgetVsActualApplication';
import { BudgetVsActualService } from './BudgetVsActualService';
import { BudgetVsActualRepository } from './BudgetVsActualRepository';
import { BudgetVsActualMeta } from './BudgetVsActualMeta';
import { TenancyContext } from '@/modules/Tenancy/TenancyContext.service';

@Module({
  imports: [FinancialSheetCommonModule, AccountsModule, BudgetsModule],
  controllers: [BudgetVsActualController],
  providers: [
    BudgetVsActualApplication,
    BudgetVsActualService,
    BudgetVsActualRepository,
    BudgetVsActualMeta,
    TenancyContext,
  ],
})
export class BudgetVsActualModule {}
