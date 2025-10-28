import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ITransactionsLockingPartialUnlocked } from '../../TransactionsLocking/types/TransactionsLocking.types';
import { EventTrackerService } from '../EventTracker.service';
import {
  TRANSACTIONS_LOCKING_LOCKED,
  TRANSACTIONS_LOCKING_LOCKING_CANCELLED,
  TRANSACTIONS_LOCKING_PARTIALLY_UNLOCK_CANCELLED,
  TRANSACTIONS_LOCKING_PARTIALLY_UNLOCKED,
} from '../event-tracker';
import { events } from '@/common/events/events';

@Injectable()
export class TransactionsLockingEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.transactionsLocking.locked)
  public handleTransactionsLockingLockedEvent({}: ITransactionsLockingPartialUnlocked) {
    this.posthog.trackEvent({
      event: TRANSACTIONS_LOCKING_LOCKED,
      properties: {},
    });
  }

  @OnEvent(events.transactionsLocking.lockCanceled)
  public handleTransactionsLockingCancelledEvent({}: ITransactionsLockingPartialUnlocked) {
    this.posthog.trackEvent({
      event: TRANSACTIONS_LOCKING_LOCKING_CANCELLED,
      properties: {},
    });
  }

  @OnEvent(events.transactionsLocking.partialUnlocked)
  public handleTransactionsLockingPartiallyUnlockedEvent({}: ITransactionsLockingPartialUnlocked) {
    this.posthog.trackEvent({
      event: TRANSACTIONS_LOCKING_PARTIALLY_UNLOCKED,
      properties: {},
    });
  }

  @OnEvent(events.transactionsLocking.partialUnlockCanceled)
  public handleTransactionsLockingPartiallyUnlockCancelledEvent({}: ITransactionsLockingPartialUnlocked) {
    this.posthog.trackEvent({
      event: TRANSACTIONS_LOCKING_PARTIALLY_UNLOCK_CANCELLED,
      properties: {},
    });
  }
}
