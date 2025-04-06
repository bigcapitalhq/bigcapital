import { Module } from "@nestjs/common";
import { EnsureTenantIsInitializedGuard } from "./EnsureTenantIsInitialized.guard";
import { TenancyGlobalGuard } from "./TenancyGlobal.guard";
import { EnsureTenantIsSeededGuard } from "./EnsureTenantIsSeeded.guards";
import { APP_GUARD } from "@nestjs/core";
import { TenancyContext } from "./TenancyContext.service";
import { TenantController } from "./Tenant.controller";


@Module({
  exports: [TenancyContext],
  controllers: [TenantController],
  providers: [
    TenancyContext,
    {
      provide: APP_GUARD,
      useClass: TenancyGlobalGuard,
    },
    {
      provide: APP_GUARD,
      useClass: EnsureTenantIsInitializedGuard,
    },
    {
      provide: APP_GUARD,
      useClass: EnsureTenantIsSeededGuard
    }
  ]
})
export class TenancyModule {}