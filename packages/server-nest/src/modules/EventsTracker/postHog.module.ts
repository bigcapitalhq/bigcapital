import { Module } from '@nestjs/common';
import { PostHog } from 'posthog-node';
import { EventTrackerService } from './EventTracker.service';
import { ConfigService } from '@nestjs/config';

export const POSTHOG = 'PostHog';

@Module({
  providers: [
    EventTrackerService,
    {
      provide: POSTHOG,
      useFactory: (configService: ConfigService) =>
        new PostHog(configService.get('posthog.apiKey'), {
          host: configService.get('posthog.host'),
        }),
      inject: [ConfigService],
    },
  ],
  exports: [EventTrackerService],
})
export class PostHogModule {}
