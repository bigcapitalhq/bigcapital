import { Module } from '@nestjs/common';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { BudgetsFeatureGuard } from '@/modules/Budgets/BudgetsFeatureGuard';
import { FeaturesModule } from '@/modules/Features/Features.module';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { BudgetVsActualController } from './BudgetVsActual.controller';
import { BudgetVsActualApplication } from './BudgetVsActualApplication';
import { BudgetVsActualService } from './BudgetVsActualService';
import { BudgetVsActualRepository } from './BudgetVsActualRepository';
import { BudgetVsActualMeta } from './BudgetVsActualMeta';
import { BudgetVsActualTableInjectable } from './BudgetVsActualTableInjectable';
import { BudgetVsActualExportInjectable } from './BudgetVsActualExportInjectable';
import { BudgetVsActualPdfInjectable } from './BudgetVsActualPdfInjectable';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule, FeaturesModule],
  controllers: [BudgetVsActualController],
  providers: [
    BudgetVsActualApplication,
    BudgetVsActualService,
    BudgetVsActualRepository,
    BudgetVsActualMeta,
    BudgetVsActualTableInjectable,
    BudgetVsActualExportInjectable,
    BudgetVsActualPdfInjectable,
    BudgetsFeatureGuard,
  ],
})
export class BudgetVsActualModule {}
