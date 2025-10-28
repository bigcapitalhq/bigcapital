import { Module } from '@nestjs/common';
import { VendorBalanceSummaryController } from './VendorBalanceSummary.controller';
import { VendorBalanceSummaryService } from './VendorBalanceSummaryService';
import { VendorBalanceSummaryTableInjectable } from './VendorBalanceSummaryTableInjectable';
import { VendorBalanceSummaryExportInjectable } from './VendorBalanceSummaryExportInjectable';
import { VendorBalanceSummaryPdf } from './VendorBalanceSummaryPdf';
import { VendorBalanceSummaryApplication } from './VendorBalanceSummaryApplication';
import { VendorBalanceSummaryRepository } from './VendorBalanceSummaryRepository';
import { VendorBalanceSummaryMeta } from './VendorBalanceSummaryMeta';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';

@Module({
  imports: [FinancialSheetCommonModule],
  providers: [
    VendorBalanceSummaryTableInjectable,
    VendorBalanceSummaryExportInjectable,
    VendorBalanceSummaryService,
    VendorBalanceSummaryPdf,
    VendorBalanceSummaryApplication,
    VendorBalanceSummaryRepository,
    VendorBalanceSummaryMeta
  ],
  controllers: [VendorBalanceSummaryController],
})
export class VendorBalanceSummaryModule {}
