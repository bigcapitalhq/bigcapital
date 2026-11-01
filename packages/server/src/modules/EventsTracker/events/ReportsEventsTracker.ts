import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  BALANCE_SHEET_VIEWED,
  TRIAL_BALANCE_SHEET_VIEWED,
  PROFIT_LOSS_SHEET_VIEWED,
  CASHFLOW_STATEMENT_VIEWED,
  GENERAL_LEDGER_VIEWED,
  JOURNAL_VIEWED,
  RECEIVABLE_AGING_VIEWED,
  PAYABLE_AGING_VIEWED,
  CUSTOMER_BALANCE_SUMMARY_VIEWED,
  VENDOR_BALANCE_SUMMARY_VIEWED,
  INVENTORY_VALUATION_VIEWED,
  CUSTOMER_TRANSACTIONS_VIEWED,
  VENDOR_TRANSACTIONS_VIEWED,
  SALES_BY_ITEM_VIEWED,
  PURCHASES_BY_ITEM_VIEWED,
} from '../event-tracker';
import { events } from '@/common/events/events';
import { EventTrackerService } from '../EventTracker.service';

@Injectable()
export class ReportsEventsTracker {
  constructor(private readonly posthog: EventTrackerService) {}

  @OnEvent(events.reports.onBalanceSheetViewed)
  handleTrackBalanceSheetViewedEvent() {
    this.posthog.trackEvent({
      event: BALANCE_SHEET_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onTrialBalanceSheetView)
  handleTrackTrialBalanceSheetViewedEvent() {
    this.posthog.trackEvent({
      event: TRIAL_BALANCE_SHEET_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onProfitLossSheetViewed)
  handleTrackProfitLossSheetViewedEvent() {
    this.posthog.trackEvent({
      event: PROFIT_LOSS_SHEET_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onCashflowStatementViewed)
  handleTrackCashflowStatementViewedEvent() {
    this.posthog.trackEvent({
      event: CASHFLOW_STATEMENT_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onGeneralLedgerViewed)
  handleTrackGeneralLedgerViewedEvent() {
    this.posthog.trackEvent({
      event: GENERAL_LEDGER_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onJournalViewed)
  handleTrackJournalViewedEvent() {
    this.posthog.trackEvent({
      event: JOURNAL_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onReceivableAgingViewed)
  handleTrackReceivableAgingViewedEvent() {
    this.posthog.trackEvent({
      event: RECEIVABLE_AGING_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onPayableAgingViewed)
  handleTrackPayableAgingViewedEvent() {
    this.posthog.trackEvent({
      event: PAYABLE_AGING_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onCustomerBalanceSummaryViewed)
  handleTrackCustomerBalanceSummaryViewedEvent() {
    this.posthog.trackEvent({
      event: CUSTOMER_BALANCE_SUMMARY_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onVendorBalanceSummaryViewed)
  handleTrackVendorBalanceSummaryViewedEvent() {
    this.posthog.trackEvent({
      event: VENDOR_BALANCE_SUMMARY_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onInventoryValuationViewed)
  handleTrackInventoryValuationViewedEvent() {
    this.posthog.trackEvent({
      event: INVENTORY_VALUATION_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onCustomerTransactionsViewed)
  handleTrackCustomerTransactionsViewedEvent() {
    this.posthog.trackEvent({
      event: CUSTOMER_TRANSACTIONS_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onVendorTransactionsViewed)
  handleTrackVendorTransactionsViewedEvent() {
    this.posthog.trackEvent({
      event: VENDOR_TRANSACTIONS_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onSalesByItemViewed)
  handleTrackSalesByItemViewedEvent() {
    this.posthog.trackEvent({
      event: SALES_BY_ITEM_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onPurchasesByItemViewed)
  handleTrackPurchasesByItemViewedEvent() {
    this.posthog.trackEvent({
      event: PURCHASES_BY_ITEM_VIEWED,
      properties: {},
    });
  }
}
