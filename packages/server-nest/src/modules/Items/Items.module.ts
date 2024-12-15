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
    GetItemService,
    ItemTransactionsService,
    TenancyContext,
    TransformerInjectable,
  ],
})
export class ItemsModule {}
