import { Module } from '@nestjs/common';
import { APAgingSummaryService } from './APAgingSummaryService';
import { AgingSummaryModule } from '../AgingSummary/AgingSummary.module';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';
import { APAgingSummaryExportInjectable } from './APAgingSummaryExportInjectable';
import { APAgingSummaryPdfInjectable } from './APAgingSummaryPdfInjectable';
import { APAgingSummaryRepository } from './APAgingSummaryRepository';
import { APAgingSummaryApplication } from './APAgingSummaryApplication';
import { APAgingSummaryController } from './APAgingSummary.controller';
import { APAgingSummaryMeta } from './APAgingSummaryMeta';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';
import { TenancyModule } from '@/modules/Tenancy/Tenancy.module';

@Module({
  imports: [TenancyModule, AgingSummaryModule, FinancialSheetCommonModule],
  providers: [
    APAgingSummaryService,
    APAgingSummaryMeta,
    APAgingSummaryTableInjectable,
    APAgingSummaryExportInjectable,
    APAgingSummaryPdfInjectable,
    APAgingSummaryRepository,
    APAgingSummaryApplication,
  ],
  controllers: [APAgingSummaryController],
})
export class APAgingSummaryModule {}
