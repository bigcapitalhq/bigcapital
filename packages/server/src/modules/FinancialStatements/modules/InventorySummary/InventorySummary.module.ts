import { Module } from '@nestjs/common';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { InventoryCostModule } from '@/modules/InventoryCost/InventoryCost.module';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';
import { InventorySummaryApplication } from './InventorySummaryApplication';
import { InventorySummaryController } from './InventorySummary.controller';
import { InventorySummaryExportInjectable } from './InventorySummaryExportInjectable';
import { InventorySummaryMeta } from './InventorySummaryMeta';
import { InventorySummaryRepository } from './InventorySummaryRepository';
import { InventorySummaryService } from './InventorySummaryService';
import { InventorySummaryTableInjectable } from './InventorySummaryTableInjectable';
import { InventorySummaryTablePdf } from './InventorySummaryTablePdf';

@Module({
  imports: [TenancyModule, FinancialSheetCommonModule, InventoryCostModule],
  providers: [
    InventorySummaryApplication,
    InventorySummaryService,
    InventorySummaryRepository,
    InventorySummaryMeta,
    InventorySummaryTableInjectable,
    InventorySummaryExportInjectable,
    InventorySummaryTablePdf,
  ],
  controllers: [InventorySummaryController],
  exports: [InventorySummaryApplication],
})
export class InventorySummaryModule {}
