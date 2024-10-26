import { Inject, Service } from 'typedi';
import { EventSubscriber } from '@/lib/EventPublisher/EventPublisher';
import { ReportsEvents } from '@/constants/event-tracker';
import { PosthogService } from '../PostHog';
import events from '@/subscribers/events';
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
} from '@/constants/event-tracker';

@Service()
export class ReportsEventsTracker extends EventSubscriber {
  @Inject()
  private posthog: PosthogService;

  /**
   * Constructor method.
   */
  public attach(bus) {
    bus.subscribe(
      events.reports.onBalanceSheetViewed,
      this.handleTrackBalanceSheetViewedEvent
    );
    bus.subscribe(
      events.reports.onTrialBalanceSheetView,
      this.handleTrackTrialBalanceSheetViewedEvent
    );
    bus.subscribe(
      events.reports.onProfitLossSheetViewed,
      this.handleTrackProfitLossSheetViewedEvent
    );
    bus.subscribe(
      events.reports.onCashflowStatementViewed,
      this.handleTrackCashflowStatementViewedEvent
    );
    bus.subscribe(
      events.reports.onGeneralLedgerViewed,
      this.handleTrackGeneralLedgerViewedEvent
    );
    bus.subscribe(
      events.reports.onJournalViewed,
      this.handleTrackJournalViewedEvent
    );
    bus.subscribe(
      events.reports.onReceivableAgingViewed,
      this.handleTrackReceivableAgingViewedEvent
    );
    bus.subscribe(
      events.reports.onPayableAgingViewed,
      this.handleTrackPayableAgingViewedEvent
    );
    bus.subscribe(
      events.reports.onCustomerBalanceSummaryViewed,
      this.handleTrackCustomerBalanceSummaryViewedEvent
    );
    bus.subscribe(
      events.reports.onVendorBalanceSummaryViewed,
      this.handleTrackVendorBalanceSummaryViewedEvent
    );
    bus.subscribe(
      events.reports.onInventoryValuationViewed,
      this.handleTrackInventoryValuationViewedEvent
    );
    bus.subscribe(
      events.reports.onCustomerTransactionsViewed,
      this.handleTrackCustomerTransactionsViewedEvent
    );
    bus.subscribe(
      events.reports.onVendorTransactionsViewed,
      this.handleTrackVendorTransactionsViewedEvent
    );
    bus.subscribe(
      events.reports.onSalesByItemViewed,
      this.handleTrackSalesByItemViewedEvent
    );
    bus.subscribe(
      events.reports.onPurchasesByItemViewed,
      this.handleTrackPurchasesByItemViewedEvent
    );
  }

  private handleTrackBalanceSheetViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: BALANCE_SHEET_VIEWED,
      properties: {},
    });
  };

  private handleTrackTrialBalanceSheetViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: TRIAL_BALANCE_SHEET_VIEWED,
      properties: {},
    });
  };

  private handleTrackProfitLossSheetViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PROFIT_LOSS_SHEET_VIEWED,
      properties: {},
    });
  };

  private handleTrackCashflowStatementViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: CASHFLOW_STATEMENT_VIEWED,
      properties: {},
    });
  };

  private handleTrackGeneralLedgerViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: GENERAL_LEDGER_VIEWED,
      properties: {},
    });
  };

  private handleTrackJournalViewedEvent = ({ tenantId }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: JOURNAL_VIEWED,
      properties: {},
    });
  };

  private handleTrackReceivableAgingViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: RECEIVABLE_AGING_VIEWED,
      properties: {},
    });
  };

  private handleTrackPayableAgingViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PAYABLE_AGING_VIEWED,
      properties: {},
    });
  };

  private handleTrackCustomerBalanceSummaryViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: CUSTOMER_BALANCE_SUMMARY_VIEWED,
      properties: {},
    });
  };

  private handleTrackVendorBalanceSummaryViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: VENDOR_BALANCE_SUMMARY_VIEWED,
      properties: {},
    });
  };

  private handleTrackInventoryValuationViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: INVENTORY_VALUATION_VIEWED,
      properties: {},
    });
  };

  private handleTrackCustomerTransactionsViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: CUSTOMER_TRANSACTIONS_VIEWED,
      properties: {},
    });
  };

  private handleTrackVendorTransactionsViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: VENDOR_TRANSACTIONS_VIEWED,
      properties: {},
    });
  };

  private handleTrackSalesByItemViewedEvent = ({ tenantId }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: SALES_BY_ITEM_VIEWED,
      properties: {},
    });
  };

  private handleTrackPurchasesByItemViewedEvent = ({
    tenantId,
  }: ReportsEvents) => {
    this.posthog.trackEvent({
      distinctId: `tenant-${tenantId}`,
      event: PURCHASES_BY_ITEM_VIEWED,
      properties: {},
    });
  };
}
