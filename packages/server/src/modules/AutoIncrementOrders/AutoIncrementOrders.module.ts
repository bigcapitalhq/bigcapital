import { Module } from '@nestjs/common';
import { TenancyDatabaseModule } from '../Tenancy/TenancyDB/TenancyDB.module';
import { AutoIncrementOrdersService } from './AutoIncrementOrders.service';

@Module({
  imports: [TenancyDatabaseModule],
  controllers: [],
  providers: [AutoIncrementOrdersService],
  exports: [AutoIncrementOrdersService],
})
export class AutoIncrementOrdersModule {}
