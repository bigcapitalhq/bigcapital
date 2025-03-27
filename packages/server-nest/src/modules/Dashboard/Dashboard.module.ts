import { Module } from '@nestjs/common';
import { DashboardService } from './Dashboard.service';
import { FeaturesModule } from '../Features/Features.module';
import { DashboardController } from './Dashboard.controller';
import { TenancyContext } from '../Tenancy/TenancyContext.service';

@Module({
  imports: [FeaturesModule],
  providers: [DashboardService, TenancyContext],
  controllers: [DashboardController],
})
export class DashboardModule {}
