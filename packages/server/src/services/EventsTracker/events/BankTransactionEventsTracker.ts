import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
import {
  BANK_TRANSACTION_MATCHED,
  BANK_TRANSACTION_EXCLUDED,
  BANK_TRANSACTION_CATEGORIZED,
  BANK_TRANSACTION_UNCATEGORIZED,
  BANK_ACCOUNT_DISCONNECTED,
} from '@/constants/event-tracker';
import { IBankTransactionMatchedEventPayload } from '@/services/Banking/Matching/types';
import { IBankAccountDisconnectedEventPayload } from '@/services/Banking/BankAccounts/types';
import {
  ICashflowTransactionCategorizedPayload,
  ICashflowTransactionUncategorizedPayload,
} from '@/interfaces';
import { IBankTransactionExcludedEventPayload } from '@/services/Banking/Exclude/_types';

@Service()
export class BankTransactionEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  public attach(bus) {
    bus.subscribe(
      events.bankMatch.onMatched,
      this.handleTrackBankTransactionMatchedEvent
    );
    bus.subscribe(
      events.bankTransactions.onExcluded,
      this.handleTrackBankTransactionExcludedEvent
    );
    bus.subscribe(
      events.cashflow.onTransactionCategorized,
      this.handleTrackBankTransactionCategorizedEvent
    );
    bus.subscribe(
      events.cashflow.onTransactionUncategorized,
      this.handleTrackBankTransactionUncategorizedEvent
    );
    bus.subscribe(
      events.bankAccount.onDisconnected,
      this.handleTrackBankAccountDisconnectedEvent
    );
  }

  private handleTrackBankTransactionMatchedEvent = ({
    tenantId,
  }: IBankTransactionMatchedEventPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BANK_TRANSACTION_MATCHED,
      properties: {},
    });
  };

  private handleTrackBankTransactionExcludedEvent = ({
    tenantId,
  }: IBankTransactionExcludedEventPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BANK_TRANSACTION_EXCLUDED,
      properties: {},
    });
  };

  private handleTrackBankTransactionCategorizedEvent = ({
    tenantId,
  }: ICashflowTransactionCategorizedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BANK_TRANSACTION_CATEGORIZED,
      properties: {},
    });
  };

  private handleTrackBankTransactionUncategorizedEvent = ({
    tenantId,
  }: ICashflowTransactionUncategorizedPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BANK_TRANSACTION_UNCATEGORIZED,
      properties: {},
    });
  };

  private handleTrackBankAccountDisconnectedEvent = ({
    tenantId,
  }: IBankAccountDisconnectedEventPayload) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BANK_ACCOUNT_DISCONNECTED,
      properties: {},
    });
  };
}
