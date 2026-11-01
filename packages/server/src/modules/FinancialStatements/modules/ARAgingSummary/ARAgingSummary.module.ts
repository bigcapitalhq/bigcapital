import { Module } from '@nestjs/common';
import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';
import { ARAgingSummaryExportInjectable } from './ARAgingSummaryExportInjectable';
import { ARAgingSummaryService } from './ARAgingSummaryService';
import { ARAgingSummaryPdfInjectable } from './ARAgingSummaryPdfInjectable';
import { AgingSummaryModule } from '../AgingSummary/AgingSummary.module';
import { ARAgingSummaryRepository } from './ARAgingSummaryRepository';
import { ARAgingSummaryApplication } from './ARAgingSummaryApplication';
import { ARAgingSummaryController } from './ARAgingSummary.controller';
import { ARAgingSummaryMeta } from './ARAgingSummaryMeta';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';

@Module({
  imports: [TenancyModule, AgingSummaryModule, FinancialSheetCommonModule],
  controllers: [ARAgingSummaryController],
  providers: [
    ARAgingSummaryTableInjectable,
    ARAgingSummaryExportInjectable,
    ARAgingSummaryService,
    ARAgingSummaryPdfInjectable,
    ARAgingSummaryRepository,
    ARAgingSummaryApplication,
    ARAgingSummaryMeta,
  ],
})
export class ARAgingSummaryModule {}
