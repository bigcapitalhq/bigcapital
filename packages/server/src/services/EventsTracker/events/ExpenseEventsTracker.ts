import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import {
  IExpenseCreatedPayload,
  IExpenseEventEditPayload,
  IExpenseEventDeletePayload,
} from '@/interfaces';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  EXPENSE_CREATED,
  EXPENSE_EDITED,
  EXPENSE_DELETED,
} from '@/constants/event-tracker';

@Service()
export class ExpenseEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.expenses.onCreated,
      this.handleTrackExpenseCreatedEvent
    );
    bus.subscribe(events.expenses.onEdited, this.handleTrackEditedExpenseEvent);
    bus.subscribe(
      events.expenses.onDeleted,
      this.handleTrackDeletedExpenseEvent
    );
  }

  private handleTrackExpenseCreatedEvent = ({
    tenantId,
  }: IExpenseCreatedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: EXPENSE_CREATED,
      properties: {},
    });
  };

  private handleTrackEditedExpenseEvent = ({
    tenantId,
  }: IExpenseEventEditPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: EXPENSE_EDITED,
      properties: {},
    });
  };

  private handleTrackDeletedExpenseEvent = ({
    tenantId,
  }: IExpenseEventDeletePayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: EXPENSE_DELETED,
      properties: {},
    });
  };
}
