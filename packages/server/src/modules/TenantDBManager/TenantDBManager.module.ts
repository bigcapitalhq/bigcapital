import { Module } from '@nestjs/common';
import { TenantsManagerService } from './TenantsManager';
import { TenantDBManager } from './TenantDBManager';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Module({
  providers: [TenancyContext, TenantsManagerService, TenantDBManager],
  exports: [TenantsManagerService, TenantDBManager],
})
export class TenantDBManagerModule {}
