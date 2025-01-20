import { Module } from '@nestjs/common';
import { VendorBalanceSummaryController } from './VendorBalanceSummary.controller';
import { VendorBalanceSummaryService } from './VendorBalanceSummaryService';
import { VendorBalanceSummaryTableInjectable } from './VendorBalanceSummaryTableInjectable';
import { VendorBalanceSummaryExportInjectable } from './VendorBalanceSummaryExportInjectable';
import { VendorBalanceSummaryPdf } from './VendorBalanceSummaryPdf';
import { VendorBalanceSummaryApplication } from './VendorBalanceSummaryApplication';

@Module({
  providers: [
    VendorBalanceSummaryTableInjectable,
    VendorBalanceSummaryExportInjectable,
    VendorBalanceSummaryService,
    VendorBalanceSummaryPdf,
    VendorBalanceSummaryApplication,
  ],
  controllers: [VendorBalanceSummaryController],
})
export class VendorBalanceSummaryModule {}
