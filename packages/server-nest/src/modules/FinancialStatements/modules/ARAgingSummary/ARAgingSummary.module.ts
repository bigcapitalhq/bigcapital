import { Module } from '@nestjs/common';
import { ARAgingSummaryTableInjectable } from './ARAgingSummaryTableInjectable';
import { ARAgingSummaryExportInjectable } from './ARAgingSummaryExportInjectable';
import { ARAgingSummaryService } from './ARAgingSummaryService';
import { ARAgingSummaryPdfInjectable } from './ARAgingSummaryPdfInjectable';
import { AgingSummaryModule } from '../AgingSummary/AgingSummary.module';
import { ARAgingSummaryRepository } from './ARAgingSummaryRepository';
import { ARAgingSummaryApplication } from './ARAgingSummaryApplication';
import { ARAgingSummaryController } from './ARAgingSummary.controller';

@Module({
  imports: [AgingSummaryModule],
  controllers: [ARAgingSummaryController],
  providers: [
    ARAgingSummaryTableInjectable,
    ARAgingSummaryExportInjectable,
    ARAgingSummaryService,
    ARAgingSummaryPdfInjectable,
    ARAgingSummaryRepository,
    ARAgingSummaryApplication,
  ],
})
export class ARAgingSummaryModule {}
