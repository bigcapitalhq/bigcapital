import { Module } from '@nestjs/common';
import { GetCurrentOrganizationService } from './queries/GetCurrentOrganization.service';
import { BuildOrganizationService } from './commands/BuildOrganization.service';
import { UpdateOrganizationService } from './commands/UpdateOrganization.service';
import { OrganizationController } from './Organization.controller';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullModule } from '@nestjs/bullmq';
import { OrganizationBuildQueue } from './Organization.types';
import { OrganizationBuildProcessor } from './processors/OrganizationBuild.processor';
import { CommandOrganizationValidators } from './commands/CommandOrganizationValidators.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TenantDBManagerModule } from '../TenantDBManager/TenantDBManager.module';
import { OrganizationBaseCurrencyLocking } from './Organization/OrganizationBaseCurrencyLocking.service';
import { SyncSystemUserToTenantService } from './commands/SyncSystemUserToTenant.service';
import { SyncSystemUserToTenantSubscriber } from './subscribers/SyncSystemUserToTenant.subscriber';
import { GetBuildOrganizationBuildJob } from './commands/GetBuildOrganizationJob.service';

@Module({
  providers: [
    TenancyContext,
    GetCurrentOrganizationService,
    BuildOrganizationService,
    UpdateOrganizationService,
    OrganizationBuildProcessor,
    CommandOrganizationValidators,
    OrganizationBaseCurrencyLocking,
    SyncSystemUserToTenantService,
    SyncSystemUserToTenantSubscriber,
    GetBuildOrganizationBuildJob,
  ],
  imports: [
    BullModule.registerQueue({ name: OrganizationBuildQueue }),
    BullBoardModule.forFeature({
      name: OrganizationBuildQueue,
      adapter: BullMQAdapter,
    }),
    TenantDBManagerModule,
  ],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
