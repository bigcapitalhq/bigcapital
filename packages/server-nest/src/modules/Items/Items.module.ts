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

@Module({
  imports: [TenancyDatabaseModule],
  controllers: [ItemsController],
  providers: [
    ItemsValidators,
    CreateItemService,
    EditItemService,
    InactivateItem,
    ActivateItemService,
    DeleteItemService,
    ItemsApplicationService,
    TenancyContext,
  ],
})
export class ItemsModule {}
