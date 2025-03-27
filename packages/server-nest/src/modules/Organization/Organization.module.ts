import { Module } from '@nestjs/common';
import { GetCurrentOrganizationService } from './queries/GetCurrentOrganization.service';
import { BuildOrganizationService } from './commands/BuildOrganization.service';
import { UpdateOrganizationService } from './commands/UpdateOrganization.service';
import { OrganizationController } from './Organization.controller';
import { BullModule } from '@nestjs/bullmq';
import { OrganizationBuildQueue } from './Organization.types';
import { OrganizationBuildProcessor } from './processors/OrganizationBuild.processor';
import { CommandOrganizationValidators } from './commands/CommandOrganizationValidators.service';

@Module({
  providers: [
    GetCurrentOrganizationService,
    BuildOrganizationService,
    UpdateOrganizationService,
    OrganizationBuildProcessor,
    CommandOrganizationValidators,
  ],
  imports: [BullModule.registerQueue({ name: OrganizationBuildQueue })],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
