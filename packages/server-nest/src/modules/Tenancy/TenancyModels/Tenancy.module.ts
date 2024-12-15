import { Knex } from 'knex';
import { Global, Module, Scope } from '@nestjs/common';
import { TENANCY_DB_CONNECTION } from '../TenancyDB/TenancyDB.constants';

import { Item } from '../../../modules/Items/models/Item';
import { Account } from '@/modules/Accounts/models/Account';
import { ItemEntry } from '@/modules/Items/models/ItemEntry';

const models = [Item, Account, ItemEntry];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    inject: [TENANCY_DB_CONNECTION],
    scope: Scope.REQUEST,
    useFactory: async (tenantKnex: Knex) => {
      return model.bindKnex(tenantKnex);
    },
  };
});

@Global()
@Module({
  providers: [...modelProviders],
  exports: [...modelProviders],
})
export class TenancyModelsModule {}
