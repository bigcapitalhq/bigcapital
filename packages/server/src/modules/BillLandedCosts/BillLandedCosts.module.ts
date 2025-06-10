import { Module } from '@nestjs/common';
import { TransactionLandedCostEntriesService } from './TransactionLandedCostEntries.service';
import { AllocateLandedCostService } from './commands/AllocateLandedCost.service';
import { LandedCostGLEntriesSubscriber } from './commands/LandedCostGLEntries.subscriber';
import { LandedCostGLEntries } from './commands/LandedCostGLEntries.service';
import { LandedCostSyncCostTransactions } from './commands/LandedCostSyncCostTransactions.service';
import { LandedCostSyncCostTransactionsSubscriber } from './commands/LandedCostSyncCostTransactions.subscriber';
import { BillAllocatedLandedCostTransactions } from './commands/BillAllocatedLandedCostTransactions.service';
import { BillAllocateLandedCostController } from './LandedCost.controller';
import { RevertAllocatedLandedCost } from './commands/RevertAllocatedLandedCost.service';
import LandedCostTranasctions from './commands/LandedCostTransactions.service';
import { LandedCostInventoryTransactions } from './commands/LandedCostInventoryTransactions.service';
import { InventoryCostModule } from '../InventoryCost/InventoryCost.module';

@Module({
  imports: [InventoryCostModule],
  providers: [
    AllocateLandedCostService,
    TransactionLandedCostEntriesService,
    BillAllocatedLandedCostTransactions,
    LandedCostGLEntriesSubscriber,
    LandedCostGLEntries,
    LandedCostSyncCostTransactions,
    RevertAllocatedLandedCost,
    LandedCostInventoryTransactions,
    LandedCostTranasctions,
    LandedCostSyncCostTransactionsSubscriber,
  ],
  exports: [TransactionLandedCostEntriesService],
  controllers: [BillAllocateLandedCostController],
})
export class BillLandedCostsModule {}
