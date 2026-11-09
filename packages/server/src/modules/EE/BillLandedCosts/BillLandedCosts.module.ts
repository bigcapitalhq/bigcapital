import { forwardRef, Module } from '@nestjs/common';
import { TransactionLandedCostEntriesService } from './TransactionLandedCostEntries.service';
import { AllocateLandedCostService } from './commands/AllocateLandedCost.service';
import { LandedCostGLEntriesSubscriber } from './commands/LandedCostGLEntries.subscriber';
import { LandedCostGLEntriesService } from './commands/LandedCostGLEntries.service';
import { LandedCostSyncCostTransactions } from './commands/LandedCostSyncCostTransactions.service';
import { LedgerModule } from '../../Ledger/Ledger.module';
import { LandedCostSyncCostTransactionsSubscriber } from './commands/LandedCostSyncCostTransactions.subscriber';
import { LandedCostInventoryTransactionsSubscriber } from './commands/LandedCostInventoryTransactions.subscriber';
import { BillAllocatedLandedCostTransactions } from './commands/BillAllocatedLandedCostTransactions.service';
import { BillAllocateLandedCostController } from './LandedCost.controller';
import { RevertAllocatedLandedCost } from './commands/RevertAllocatedLandedCost.service';
import { LandedCostTranasctions } from './commands/LandedCostTransactions.service';
import { LandedCostInventoryTransactions } from './commands/LandedCostInventoryTransactions.service';
import { InventoryCostModule } from '../../InventoryCost/InventoryCost.module';
import { TransactionLandedCost } from './commands/TransctionLandedCost.service';
import { ExpenseLandedCost } from './commands/ExpenseLandedCost.service';
import { BillLandedCost as BillLandedCostService } from './commands/BillLandedCost.service';
import { FeaturesModule } from '../../Features/Features.module';
import { LandedCostFeatureGuard } from './LandedCostFeatureGuard';
import { RegisterTenancyModel } from '../../Tenancy/TenancyModels/Tenancy.module';
import { BillLandedCostsIntegrationModule } from '../../Bills/integrations/BillLandedCostsIntegration.module';
import { LandedCostsBridgeProvider } from './LandedCostsBridge.provider';
import { BillLandedCost } from './models/BillLandedCost';
import { BillLandedCostEntry } from './models/BillLandedCostEntry';

const models = [
  RegisterTenancyModel(BillLandedCost),
  RegisterTenancyModel(BillLandedCostEntry),
];

@Module({
  imports: [
    ...models,
    forwardRef(() => InventoryCostModule),
    LedgerModule,
    FeaturesModule,
    BillLandedCostsIntegrationModule,
  ],
  providers: [
    AllocateLandedCostService,
    TransactionLandedCostEntriesService,
    BillAllocatedLandedCostTransactions,
    LandedCostGLEntriesService,
    TransactionLandedCost,
    BillLandedCostService,
    ExpenseLandedCost,
    LandedCostSyncCostTransactions,
    RevertAllocatedLandedCost,
    LandedCostInventoryTransactions,
    LandedCostTranasctions,
    LandedCostGLEntriesSubscriber,
    LandedCostInventoryTransactionsSubscriber,
    LandedCostSyncCostTransactionsSubscriber,
    LandedCostFeatureGuard,
    LandedCostsBridgeProvider,
  ],
  controllers: [BillAllocateLandedCostController],
})
export class BillLandedCostsModule {}
