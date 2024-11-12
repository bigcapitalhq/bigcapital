import { Module } from '@nestjs/common';
import { ItemsController } from './Item.controller';
import { CreateItemService } from './CreateItem.service';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { ItemsValidators } from './ItemValidator.service';
import { DeleteItemService } from './DeleteItem.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Module({
  imports: [TenancyDatabaseModule],
  controllers: [ItemsController],
  providers: [
    ItemsValidators,
    CreateItemService,
    DeleteItemService,
    TenancyContext,
  ],
})
export class ItemsModule {}
