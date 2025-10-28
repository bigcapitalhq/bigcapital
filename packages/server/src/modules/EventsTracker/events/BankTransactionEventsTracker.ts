import {
  BANK_TRANSACTION_MATCHED,
  BANK_TRANSACTION_EXCLUDED,
  BANK_TRANSACTION_CATEGORIZED,
  BANK_TRANSACTION_UNCATEGORIZED,
  BANK_ACCOUNT_DISCONNECTED,
} from '../event-tracker';
import { Injectable } from '@nestjs/common';
import { EventTrackerService } from '../EventTracker.service';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { IBankTransactionMatchedEventPayload } from '@/modules/BankingMatching/types';
import { IBankTransactionExcludedEventPayload } from '@/modules/BankingTransactionsExclude/types/BankTransactionsExclude.types';
import {
  ICashflowTransactionCategorizedPayload,
  ICashflowTransactionUncategorizedPayload,
} from '@/modules/BankingTransactions/types/BankingTransactions.types';
import { IBankAccountDisconnectedEventPayload } from '@/modules/BankingAccounts/types/BankAccounts.types';

@Injectable()
export class BankTransactionEventsTracker {
  constructor(public readonly posthog: EventTrackerService) {}

  @OnEvent(events.bankMatch.onMatched)
  public handleTrackBankTransactionMatchedEvent({}: IBankTransactionMatchedEventPayload) {
    this.posthog.trackEvent({
      event: BANK_TRANSACTION_MATCHED,
      properties: {},
    });
  }

  @OnEvent(events.bankTransactions.onExcluded)
  public handleTrackBankTransactionExcludedEvent({}: IBankTransactionExcludedEventPayload) {
    this.posthog.trackEvent({
      event: BANK_TRANSACTION_EXCLUDED,
      properties: {},
    });
  }

  @OnEvent(events.cashflow.onTransactionCategorized)
  public handleTrackBankTransactionCategorizedEvent({}: ICashflowTransactionCategorizedPayload) {
    this.posthog.trackEvent({
      event: BANK_TRANSACTION_CATEGORIZED,
      properties: {},
    });
  }

  @OnEvent(events.cashflow.onTransactionUncategorized)
  public handleTrackBankTransactionUncategorizedEvent({}: ICashflowTransactionUncategorizedPayload) {
    this.posthog.trackEvent({
      event: BANK_TRANSACTION_UNCATEGORIZED,
      properties: {},
    });
  }

  @OnEvent(events.bankAccount.onDisconnected)
  public handleTrackBankAccountDisconnectedEvent({}: IBankAccountDisconnectedEventPayload) {
    this.posthog.trackEvent({
      event: BANK_ACCOUNT_DISCONNECTED,
      properties: {},
    });
  }
}
