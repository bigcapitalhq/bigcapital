import { Module } from '@nestjs/common';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { AutoIncrementOrdersService } from './AutoIncrementOrders.service';

@Module({
  imports: [TenancyDatabaseModule],
  controllers: [],
  providers: [AutoIncrementOrdersService, TransformerInjectable],
  exports: [AutoIncrementOrdersService],
})
export class AutoIncrementOrdersModule {}
