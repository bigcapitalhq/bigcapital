import { Module } from '@nestjs/common';
import { CreateWarehouseTransfer } from './commands/CreateWarehouseTransfer';
import { EditWarehouseTransfer } from './commands/EditWarehouseTransfer';
import { DeleteWarehouseTransfer } from './commands/DeleteWarehouseTransfer';
import { GetWarehouseTransfer } from './queries/GetWarehouseTransfer';
import { GetWarehouseTransfers } from './queries/GetWarehouseTransfers';
import { WarehouseTransferApplication } from './WarehouseTransferApplication';
import { WarehouseTransfersController } from './WarehouseTransfers.controller';
import { WarehouseTransferInventoryTransactions } from './commands/WarehouseTransferWriteInventoryTransactions';
import { WarehouseTransferAutoIncrement } from './commands/WarehouseTransferAutoIncrement';
import { WarehouseTransferAutoIncrementSubscriber } from './susbcribers/WarehouseTransferAutoIncrementSubscriber';
import { WarehouseTransferInventoryTransactionsSubscriber } from './susbcribers/WarehouseTransferInventoryTransactionsSubscriber';
import { InitiateWarehouseTransfer } from './commands/InitiateWarehouseTransfer';
import { TransferredWarehouseTransfer } from './commands/TransferredWarehouseTransfer';
import { CommandWarehouseTransfer } from './commands/CommandWarehouseTransfer';
import { ItemsModule } from '../Items/Items.module';
import { InventoryCostModule } from '../InventoryCost/InventoryCost.module';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { WarehouseTransfer } from './models/WarehouseTransfer';
import { WarehouseTransferEntry } from './models/WarehouseTransferEntry';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { AutoIncrementOrdersModule } from '../AutoIncrementOrders/AutoIncrementOrders.module';

const models = [
  RegisterTenancyModel(WarehouseTransfer),
  RegisterTenancyModel(WarehouseTransferEntry),
];

@Module({
  imports: [
    ItemsModule,
    InventoryCostModule,
    DynamicListModule,
    AutoIncrementOrdersModule,
    ...models,
  ],
  providers: [
    WarehouseTransferApplication,
    CreateWarehouseTransfer,
    EditWarehouseTransfer,
    DeleteWarehouseTransfer,
    GetWarehouseTransfer,
    GetWarehouseTransfers,
    WarehouseTransferInventoryTransactions,
    WarehouseTransferAutoIncrement,
    WarehouseTransferAutoIncrementSubscriber,
    WarehouseTransferInventoryTransactionsSubscriber,
    TransferredWarehouseTransfer,
    InitiateWarehouseTransfer,
    CommandWarehouseTransfer,
  ],
  exports: [...models],
  controllers: [WarehouseTransfersController],
})
export class WarehousesTransfersModule { }
