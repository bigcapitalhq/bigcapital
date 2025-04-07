import { Module } from '@nestjs/common';
import { GetCurrentOrganizationService } from './queries/GetCurrentOrganization.service';
import { BuildOrganizationService } from './commands/BuildOrganization.service';
import { UpdateOrganizationService } from './commands/UpdateOrganization.service';
import { OrganizationController } from './Organization.controller';
import { BullModule } from '@nestjs/bullmq';
import { OrganizationBuildQueue } from './Organization.types';
import { OrganizationBuildProcessor } from './processors/OrganizationBuild.processor';
import { CommandOrganizationValidators } from './commands/CommandOrganizationValidators.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TenantDBManagerModule } from '../TenantDBManager/TenantDBManager.module';
import { OrganizationBaseCurrencyLocking } from './Organization/OrganizationBaseCurrencyLocking.service';

@Module({
  providers: [
    TenancyContext,
    GetCurrentOrganizationService,
    BuildOrganizationService,
    UpdateOrganizationService,
    OrganizationBuildProcessor,
    CommandOrganizationValidators,
    OrganizationBaseCurrencyLocking,
  ],
  imports: [
    BullModule.registerQueue({ name: OrganizationBuildQueue }),
    TenantDBManagerModule,
  ],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
