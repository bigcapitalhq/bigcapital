import { Knex } from 'knex';
import { Model } from 'objection';
import { Global, Module } from '@nestjs/common';
import { PlanSubscription } from '@/modules/Subscription/models/PlanSubscription';
import { TenantModel } from '@/modules/System/models/TenantModel';
import { SystemKnexConnection } from '../SystemDB/SystemDB.constants';
import { SystemModelsConnection } from './SystemModels.constants';
import { SystemUser } from '../models/SystemUser';
import { TenantMetadata } from '../models/TenantMetadataModel';

const models = [SystemUser, PlanSubscription, TenantModel, TenantMetadata];

const modelProviders = models.map((model) => {
  return {
    provide: model.name,
    useValue: model,
  };
});

const providers = [
  ...modelProviders,
  {
    provide: SystemModelsConnection,
    inject: [SystemKnexConnection],
    useFactory: async (systemKnex: Knex) => {
      Model.knex(systemKnex);
    },
  }
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class SystemModelsModule {}
