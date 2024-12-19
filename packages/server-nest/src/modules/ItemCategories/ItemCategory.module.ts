import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { CreateItemCategoryService } from './commands/CreateItemCategory.service';
import { DeleteItemCategoryService } from './commands/DeleteItemCategory.service';
import { EditItemCategoryService } from './commands/EditItemCategory.service';
import { GetItemCategoryService } from './queries/GetItemCategory.service';
import { ItemCategoryApplication } from './ItemCategory.application';
import { ItemCategoryController } from './ItemCategory.controller';

@Module({
  imports: [TenancyDatabaseModule],
  controllers: [ItemCategoryController],
  providers: [
    CreateItemCategoryService,
    EditItemCategoryService,
    GetItemCategoryService,
    DeleteItemCategoryService,
    ItemCategoryApplication,
  ],
})
export class ItemCategoryModule {}
