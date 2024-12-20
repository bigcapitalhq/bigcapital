import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { CreateItemCategoryService } from './commands/CreateItemCategory.service';
import { DeleteItemCategoryService } from './commands/DeleteItemCategory.service';
import { EditItemCategoryService } from './commands/EditItemCategory.service';
import { GetItemCategoryService } from './queries/GetItemCategory.service';
import { ItemCategoryApplication } from './ItemCategory.application';
import { ItemCategoryController } from './ItemCategory.controller';
import { CommandItemCategoryValidatorService } from './commands/CommandItemCategoryValidator.service';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Module({
  imports: [TenancyDatabaseModule],
  controllers: [ItemCategoryController],
  providers: [
    CreateItemCategoryService,
    EditItemCategoryService,
    GetItemCategoryService,
    DeleteItemCategoryService,
    ItemCategoryApplication,
    CommandItemCategoryValidatorService,
    TransformerInjectable,
    TenancyContext
  ],
})
export class ItemCategoryModule {}
