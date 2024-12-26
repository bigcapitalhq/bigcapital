import { Module } from '@nestjs/common';
import { TransactionLandedCostEntriesService } from './TransactionLandedCostEntries.service';

@Module({
  providers: [TransactionLandedCostEntriesService],
  exports: [TransactionLandedCostEntriesService],
})
export class BillLandedCostsModule {}
