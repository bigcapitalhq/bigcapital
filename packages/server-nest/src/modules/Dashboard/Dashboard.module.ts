import { Module } from '@nestjs/common';
import { DashboardService } from './Dashboard.service';
import { FeaturesModule } from '../Features/Features.module';
import { DashboardController } from './Dashboard.controller';

@Module({
  imports: [FeaturesModule],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
