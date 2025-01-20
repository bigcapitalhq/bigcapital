import { Module } from '@nestjs/common';
import { AgingSummaryMeta } from './AgingSummaryMeta';

@Module({
  exports: [AgingSummaryMeta],
  providers: [AgingSummaryMeta],
})
export class AgingSummaryModule {}
