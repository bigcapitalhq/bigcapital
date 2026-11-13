import { Module } from '@nestjs/common';
import { BatchAllocationsBridge } from './BatchAllocationsBridge';

@Module({
  providers: [BatchAllocationsBridge],
  exports: [BatchAllocationsBridge],
})
export class BatchAllocationsIntegrationModule {}
