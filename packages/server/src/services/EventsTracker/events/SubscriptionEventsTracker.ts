import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { ITransactionsLockingPartialUnlocked } from '@/interfaces';
import { PosthogService } from '../PostHog';
import {
  TRANSACTIONS_LOCKING_LOCKED,
  TRANSACTIONS_LOCKING_LOCKING_CANCELLED,
  TRANSACTIONS_LOCKING_PARTIALLY_UNLOCK_CANCELLED,
  TRANSACTIONS_LOCKING_PARTIALLY_UNLOCKED,
} from '@/constants/event-tracker';
import events from '@/subscribers/events';

@Service()
export class TransactionsLockingEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  public attach(bus) {
    bus.subscribe(
      events.transactionsLocking.locked,
      this.handleTransactionsLockingLockedEvent
    );
    bus.subscribe(
      events.transactionsLocking.lockCanceled,
      this.handleTransactionsLockingCancelledEvent
    );
    bus.subscribe(
      events.transactionsLocking.partialUnlocked,
      this.handleTransactionsLockingPartiallyUnlockedEvent
    );
    bus.subscribe(
      events.transactionsLocking.partialUnlockCanceled,
      this.handleTransactionsLockingPartiallyUnlockCancelledEvent
    );
  }

  private handleTransactionsLockingLockedEvent = ({
    tenantId,
  }: ITransactionsLockingPartialUnlocked) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: TRANSACTIONS_LOCKING_LOCKED,
      properties: {},
    });
  };

  private handleTransactionsLockingCancelledEvent = ({
    tenantId,
  }: ITransactionsLockingPartialUnlocked) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: TRANSACTIONS_LOCKING_LOCKING_CANCELLED,
      properties: {},
    });
  };

  private handleTransactionsLockingPartiallyUnlockedEvent = ({
    tenantId,
  }: ITransactionsLockingPartialUnlocked) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: TRANSACTIONS_LOCKING_PARTIALLY_UNLOCKED,
      properties: {},
    });
  };

  private handleTransactionsLockingPartiallyUnlockCancelledEvent = ({
    tenantId,
  }: ITransactionsLockingPartialUnlocked) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: TRANSACTIONS_LOCKING_PARTIALLY_UNLOCK_CANCELLED,
      properties: {},
    });
  };
}
