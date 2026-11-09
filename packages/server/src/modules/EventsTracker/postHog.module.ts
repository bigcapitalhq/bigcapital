import { Module } from '@nestjs/common';
import { PostHog } from 'posthog-node';
import { EventTrackerService } from './EventTracker.service';
import { ConfigService } from '@nestjs/config';
import { POSTHOG_PROVIDER } from './PostHog.constants';
import { TenancyModule } from '../Tenancy/Tenancy.module';

@Module({
  imports: [TenancyModule],
  providers: [
    EventTrackerService,
    {
      provide: POSTHOG_PROVIDER,
      useFactory: (configService: ConfigService) => {
        if (configService.get('posthog.apiKey')) {
          return new PostHog(configService.get('posthog.apiKey'), {
            host: configService.get('posthog.host'),
          });
        }
        return null;
      },
      inject: [ConfigService],
    },
  ],
  exports: [EventTrackerService, POSTHOG_PROVIDER],
})
export class PostHogModule {}
