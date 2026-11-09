import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { CreateItemCategoryService } from './commands/CreateItemCategory.service';
import { DeleteItemCategoryService } from './commands/DeleteItemCategory.service';
import { EditItemCategoryService } from './commands/EditItemCategory.service';
import { GetItemCategoryService } from './queries/GetItemCategory.service';
import { ItemCategoryApplication } from './ItemCategory.application';
import { ItemCategoryController } from './ItemCategory.controller';
import { CommandItemCategoryValidatorService } from './commands/CommandItemCategoryValidator.service';
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { GetItemCategoriesService } from './queries/GetItemCategories.service';
import { DynamicListModule } from '../DynamicListing/DynamicList.module';
import { ItemCategoriesExportable } from './ItemCategoriesExportable';
import { ItemCategoriesImportable } from './ItemCategoriesImportable';
import { BulkDeleteItemCategoriesService } from './BulkDeleteItemCategories.service';
import { ValidateBulkDeleteItemCategoriesService } from './ValidateBulkDeleteItemCategories.service';

@Module({
  imports: [TenancyModule, TenancyDatabaseModule, DynamicListModule],
  controllers: [ItemCategoryController],
  providers: [
    CreateItemCategoryService,
    EditItemCategoryService,
    GetItemCategoryService,
    GetItemCategoriesService,
    DeleteItemCategoryService,
    BulkDeleteItemCategoriesService,
    ValidateBulkDeleteItemCategoriesService,
    ItemCategoryApplication,
    CommandItemCategoryValidatorService,
    ItemCategoriesExportable,
    ItemCategoriesImportable,
  ],
  exports: [ItemCategoriesExportable, ItemCategoriesImportable],
})
export class ItemCategoryModule {}
