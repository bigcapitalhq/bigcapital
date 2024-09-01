import { PostHog } from 'posthog-node';
import { Service } from 'typedi';
import { EventMessage } from 'posthog-node/src/types';
import config from '@/config';

@Service()
export class PosthogService {
  public posthog: PostHog;

  constructor() {
    if (config.posthog.apiKey && config.posthog.host) {
      this.posthog = new PostHog(config.posthog.apiKey, {
        host: config.posthog.host,
      });
    }
  }

  public trackEvent(event: EventMessage) {
    // Cannot continue if the Posthog not configured.
    if (!this.posthog) return;

    this.posthog.capture(event);
  }
}
