import { Module } from "@nestjs/common";
import { EnsureTenantIsInitializedGuard } from "./EnsureTenantIsInitialized.guard";
import { TenancyGlobalGuard } from "./TenancyGlobal.guard";
import { EnsureTenantIsSeededGuard } from "./EnsureTenantIsSeeded.guards";
import { APP_GUARD } from "@nestjs/core";
import { TenancyContext } from "./TenancyContext.service";
import { TenantController } from "./Tenant.controller";
import { TenancyInitializeModelsGuard } from "./TenancyInitializeModels.guard";


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
    },
    {
      provide: APP_GUARD,
      useClass: TenancyInitializeModelsGuard
    }
  ]
})
export class TenancyModule {}