import { Module } from '@nestjs/common';
import { TenantsManagerService } from './TenantsManager';
import { TenantDBManager } from './TenantDBManager';
import { TenancyModule } from '../Tenancy/Tenancy.module';

@Module({
  imports: [TenancyModule],
  providers: [TenantsManagerService, TenantDBManager],
  exports: [TenantsManagerService, TenantDBManager],
})
export class TenantDBManagerModule {}
