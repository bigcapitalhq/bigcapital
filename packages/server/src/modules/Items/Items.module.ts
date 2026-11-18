import { Module } from '@nestjs/common';
import { ItemsController } from './Item.controller';
import { CreateItemService } from './CreateItem.service';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { ItemsValidators } from './ItemValidator.service';
import { DeleteItemService } from './DeleteItem.service';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { EditItemService } from './EditItem.service';
import { InactivateItem } from './InactivateItem.service';
import { ActivateItemService } from './ActivateItem.service';
import { ItemsApplicationService } from './ItemsApplication.service';
import { ItemTransactionsService } from './ItemTransactions.service';
import { GetItemService } from './GetItem.service';
import { ItemsEntriesService } from './ItemsEntries.service';
import { GetItemsService } from './GetItems.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { InventoryAdjustmentsModule } from '../InventoryAdjutments/InventoryAdjustments.module';
import { ItemsExportable } from './ItemsExportable.service';
import { ItemsImportable } from './ItemsImportable.service';
import { BulkDeleteItemsService } from './BulkDeleteItems.service';
import { ValidateBulkDeleteItemsService } from './ValidateBulkDeleteItems.service';
import { S3Module } from '../S3/S3.module';
import { ItemImageProcessor } from './ItemImageProcessor';
import { AddItemImagesService } from './AddItemImages.service';
import { DeleteItemImageService } from './DeleteItemImage.service';

@Module({
  imports: [
    TenancyModule,
    TenancyDatabaseModule,
    DynamicListModule,
    InventoryAdjustmentsModule,
    S3Module,
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
    ItemsEntriesService,
    ItemsExportable,
    ItemsImportable,
    BulkDeleteItemsService,
    ValidateBulkDeleteItemsService,
    ItemImageProcessor,
    AddItemImagesService,
    DeleteItemImageService,
  ],
  exports: [ItemsEntriesService, ItemsExportable, ItemsImportable],
})
export class ItemsModule {}
