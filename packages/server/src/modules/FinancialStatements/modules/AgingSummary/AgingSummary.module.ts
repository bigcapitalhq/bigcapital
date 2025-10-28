import { Module } from '@nestjs/common';
import { AgingSummaryMeta } from './AgingSummaryMeta';
import { FinancialSheetCommonModule } from '../../common/FinancialSheetCommon.module';

@Module({
  imports: [FinancialSheetCommonModule],
  exports: [AgingSummaryMeta],
  providers: [AgingSummaryMeta],
})
export class AgingSummaryModule {}
