import type {
  ExtensionEventHandler,
  ExtensionEventSubscriptionOptions,
} from '@bigcapital/extension-sdk';
import { ContributionCatalog } from './contribution.catalog';
import type { EventSubscriberContribution } from '../extension.types';

let subscriptionSequence = 0;

export class EventCatalog extends ContributionCatalog<EventSubscriberContribution> {
  registerForOwner(
    owner: string,
    event: string,
    handler: ExtensionEventHandler,
    options?: ExtensionEventSubscriptionOptions,
  ): EventSubscriberContribution {
    subscriptionSequence += 1;

    return this.register({
      id: `${owner}:${event}:${subscriptionSequence}`,
      owner,
      event,
      handler,
      options,
    });
  }
}
