import { Module } from '@nestjs/common';
import { TenantsManagerService } from './TenantsManager';
import { TenantDBManager } from './TenantDBManager';

@Module({
  providers: [TenantsManagerService, TenantDBManager],
  exports: [TenantsManagerService, TenantDBManager],
})
export class TenantDBManagerModule {}
