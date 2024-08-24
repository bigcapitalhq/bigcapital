import events from '@/subscribers/events';
import Container from 'typedi';

export class TriggerInvalidateCacheOnSubscriptionChange {
  /**
   * Attaches events with handlers.
   */
  public attach = (bus) => {
    bus.subscribe(
      events.subscription.onSubscriptionCancelled,
      this.triggerInvalidateCache.bind(this)
    );
    bus.subscribe(
      events.subscription.onSubscriptionResumed,
      this.triggerInvalidateCache.bind(this)
    );
    bus.subscribe(
      events.subscription.onSubscriptionPlanChanged,
      this.triggerInvalidateCache.bind(this)
    );
  };

  private triggerInvalidateCache() {
    const io = Container.get('socket');

    // Notify the frontend to reflect the new transactions changes.
    io.emit('SUBSCRIPTION_CHANGED', { subscriptionSlug: 'main' });
  }
}
