import { Module } from '@nestjs/common';
import { ItemsController } from './Item.controller';
import { CreateItemService } from './CreateItem.service';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { ItemsValidators } from './ItemValidator.service';
import { DeleteItemService } from './DeleteItem.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { EditItemService } from './EditItem.service';
import { InactivateItem } from './InactivateItem.service';
import { ActivateItemService } from './ActivateItem.service';
import { ItemsApplicationService } from './ItemsApplication.service';
import { ItemTransactionsService } from './ItemTransactions.service';
import { GetItemService } from './GetItem.service';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { ItemsEntriesService } from './ItemsEntries.service';
import { GetItemsService } from './GetItems.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { InventoryAdjustmentsModule } from '../InventoryAdjutments/InventoryAdjustments.module';
import { ItemsExportable } from './ItemsExportable.service';
import { ItemsImportable } from './ItemsImportable.service';
import { BulkDeleteItemsService } from './BulkDeleteItems.service';
import { ValidateBulkDeleteItemsService } from './ValidateBulkDeleteItems.service';

@Module({
  imports: [
    TenancyDatabaseModule,
    DynamicListModule,
    InventoryAdjustmentsModule,
  ],
  controllers: [ItemsController],
  providers: [
    ItemsValidators,
    CreateItemService,
    EditItemService,
    InactivateItem,
    ActivateItemService,
    DeleteItemService,
    ItemsApplicationService,
    GetItemService,
    GetItemsService,
    ItemTransactionsService,
    TenancyContext,
    TransformerInjectable,
    ItemsEntriesService,
    ItemsExportable,
    ItemsImportable,
    BulkDeleteItemsService,
    ValidateBulkDeleteItemsService,
  ],
  exports: [ItemsEntriesService, ItemsExportable, ItemsImportable],
})
export class ItemsModule { }
