import { Module } from '@nestjs/common';
import { TenantsManagerService } from './TenantsManager';
import { TenantDBManager } from './TenantDBManager';

@Module({})
export class TenantDBManagerModule {
  providers: [TenantsManagerService, TenantDBManager];
}
