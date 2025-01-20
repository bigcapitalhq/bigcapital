import { Module } from '@nestjs/common';
import { APAgingSummaryService } from './APAgingSummaryService';
import { AgingSummaryModule } from '../AgingSummary/AgingSummary.module';
import { APAgingSummaryTableInjectable } from './APAgingSummaryTableInjectable';
import { APAgingSummaryExportInjectable } from './APAgingSummaryExportInjectable';
import { APAgingSummaryPdfInjectable } from './APAgingSummaryPdfInjectable';
import { APAgingSummaryRepository } from './APAgingSummaryRepository';
import { APAgingSummaryApplication } from './APAgingSummaryApplication';
import { APAgingSummaryController } from './APAgingSummary.controller';

@Module({
  imports: [AgingSummaryModule],
  providers: [
    APAgingSummaryService,
    APAgingSummaryTableInjectable,
    APAgingSummaryExportInjectable,
    APAgingSummaryPdfInjectable,
    APAgingSummaryRepository,
    APAgingSummaryApplication
  ],
  controllers: [APAgingSummaryController],
})
export class APAgingSummaryModule {}

