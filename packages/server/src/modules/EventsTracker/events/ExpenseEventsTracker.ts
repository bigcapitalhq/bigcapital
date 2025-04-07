import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  IExpenseCreatedPayload,
  IExpenseEventEditPayload,
  IExpenseEventDeletePayload,
} from '../../Expenses/Expenses.types';
import { EventTrackerService } from '../EventTracker.service';
import { events } from '@/common/events/events';
import {
  EXPENSE_CREATED,
  EXPENSE_EDITED,
  EXPENSE_DELETED,
} from '../event-tracker';

@Injectable()
export class ExpenseEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.expenses.onCreated)
  public handleTrackExpenseCreatedEvent({}: IExpenseCreatedPayload) {
    this.posthog.trackEvent({
      event: EXPENSE_CREATED,
      properties: {},
    });
  }

  @OnEvent(events.expenses.onEdited)
  public handleTrackEditedExpenseEvent({}: IExpenseEventEditPayload) {
    this.posthog.trackEvent({
      event: EXPENSE_EDITED,
      properties: {},
    });
  }

  @OnEvent(events.expenses.onDeleted)
  public handleTrackDeletedExpenseEvent({}: IExpenseEventDeletePayload) {
    this.posthog.trackEvent({
      event: EXPENSE_DELETED,
      properties: {},
    });
  }
}
