import { Inject, Injectable } from '@nestjs/common';
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
import { POSTHOG_PROVIDER } from '../PostHog.constants';

@Injectable()
export class ReportsEventsTracker {
  constructor(@Inject(POSTHOG_PROVIDER) private readonly posthog: any) {}

  @OnEvent(events.reports.onBalanceSheetViewed)
  handleTrackBalanceSheetViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BALANCE_SHEET_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onTrialBalanceSheetView)
  handleTrackTrialBalanceSheetViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: TRIAL_BALANCE_SHEET_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onProfitLossSheetViewed)
  handleTrackProfitLossSheetViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PROFIT_LOSS_SHEET_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onCashflowStatementViewed)
  handleTrackCashflowStatementViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: CASHFLOW_STATEMENT_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onGeneralLedgerViewed)
  handleTrackGeneralLedgerViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: GENERAL_LEDGER_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onJournalViewed)
  handleTrackJournalViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: JOURNAL_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onReceivableAgingViewed)
  handleTrackReceivableAgingViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: RECEIVABLE_AGING_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onPayableAgingViewed)
  handleTrackPayableAgingViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYABLE_AGING_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onCustomerBalanceSummaryViewed)
  handleTrackCustomerBalanceSummaryViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: CUSTOMER_BALANCE_SUMMARY_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onVendorBalanceSummaryViewed)
  handleTrackVendorBalanceSummaryViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: VENDOR_BALANCE_SUMMARY_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onInventoryValuationViewed)
  handleTrackInventoryValuationViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: INVENTORY_VALUATION_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onCustomerTransactionsViewed)
  handleTrackCustomerTransactionsViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: CUSTOMER_TRANSACTIONS_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onVendorTransactionsViewed)
  handleTrackVendorTransactionsViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: VENDOR_TRANSACTIONS_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onSalesByItemViewed)
  handleTrackSalesByItemViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALES_BY_ITEM_VIEWED,
      properties: {},
    });
  }

  @OnEvent(events.reports.onPurchasesByItemViewed)
  handleTrackPurchasesByItemViewedEvent({ tenantId }: ReportsEvents) {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PURCHASES_BY_ITEM_VIEWED,
      properties: {},
    });
  }
}
