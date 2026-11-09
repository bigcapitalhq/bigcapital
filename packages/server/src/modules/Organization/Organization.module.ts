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
import { TenancyModule } from '../Tenancy/Tenancy.module';
import { TenantDBManagerModule } from '../TenantDBManager/TenantDBManager.module';
import { OrganizationBaseCurrencyLocking } from './Organization/OrganizationBaseCurrencyLocking.service';
import { SyncSystemUserToTenantService } from './commands/SyncSystemUserToTenant.service';
import { SyncSystemUserToTenantSubscriber } from './subscribers/SyncSystemUserToTenant.subscriber';
import { GetBuildOrganizationBuildJob } from './commands/GetBuildOrganizationJob.service';
import { AttachmentsModule } from '../Attachments/Attachment.module';
import { TransformerModule } from '../Transformer/Transformer.module';
import { SocketModule } from '../Socket/Socket.module';
import { OrganizationBuiltSubscriber } from './subscribers/OrganizationBuilt.subscriber';

@Module({
  providers: [
    GetCurrentOrganizationService,
    BuildOrganizationService,
    UpdateOrganizationService,
    OrganizationBuildProcessor,
    CommandOrganizationValidators,
    OrganizationBaseCurrencyLocking,
    SyncSystemUserToTenantService,
    SyncSystemUserToTenantSubscriber,
    GetBuildOrganizationBuildJob,
    OrganizationBuiltSubscriber,
  ],
  imports: [
    TenancyModule,
    BullModule.registerQueue({ name: OrganizationBuildQueue }),
    BullBoardModule.forFeature({
      name: OrganizationBuildQueue,
      adapter: BullMQAdapter,
    }),
    TenantDBManagerModule,
    AttachmentsModule,
    TransformerModule,
    SocketModule,
  ],
  controllers: [OrganizationController],
  exports: [BuildOrganizationService],
})
export class OrganizationModule {}
