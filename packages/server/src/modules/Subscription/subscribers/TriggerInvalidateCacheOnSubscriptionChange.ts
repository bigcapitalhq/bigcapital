import { events } from '@/common/events/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TriggerInvalidateCacheOnSubscriptionChange {
  @OnEvent(events.subscription.onSubscriptionCancelled)
  @OnEvent(events.subscription.onSubscriptionResumed)
  @OnEvent(events.subscription.onSubscriptionPlanChanged)
  triggerInvalidateCache() {
    // const io = Container.get('socket');

    // // Notify the frontend to reflect the new transactions changes.
    // io.emit('SUBSCRIPTION_CHANGED', { subscriptionSlug: 'main' });
  }
}
