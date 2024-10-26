import { SaleInvoiceEventsTracker } from './SaleInvoicesEventsTracker';
import { SaleEstimateEventsTracker } from './SaleEstimateEventsTracker';
import { PaymentMadeEventsTracker } from './PaymentMadeEventsTracker';
import { PaymentReceivedEventsTracker } from './PaymentReceivedEventsTracker';
import { BillEventsTracker } from './BillEventsTracker';
import { ExpenseEventsTracker } from './ExpenseEventsTracker';
import { AccountEventsTracker } from './AccountEventsTracker';
import { AuthenticationEventsTracker } from './AuthenticationEventsTracker';
import { ItemEventsTracker } from './ItemEventsTracker';
import { BankTransactionEventsTracker } from './BankTransactionEventsTracker';
import { CustomerEventsTracker } from './CustomerEventsTracker';
import { VendorEventsTracker } from './VendorEventsTracker';
import { ManualJournalEventsTracker } from './ManualJournalEventsTracker';
import { BankRuleEventsTracker } from './BankRuleEventsTracker';
import { PdfTemplateEventsTracker } from './PdfTemplateEventsTracker';
import { PaymentMethodEventsTracker } from './PaymentMethodEventsTracker';
import { PaymentLinkEventsTracker } from './PaymentLinkEventsTracker';
import { StripeIntegrationEventsTracker } from './StripeIntegrationEventsTracker';
import { ReportsEventsTracker } from './ReportsEventsTracker';

export const EventsTrackerListeners = [
  SaleInvoiceEventsTracker,
  SaleEstimateEventsTracker,
  PaymentMadeEventsTracker,
  PaymentReceivedEventsTracker,
  BillEventsTracker,
  AccountEventsTracker,
  ExpenseEventsTracker,
  AuthenticationEventsTracker,
  ItemEventsTracker,
  BankTransactionEventsTracker,
  CustomerEventsTracker,
  VendorEventsTracker,
  ManualJournalEventsTracker,
  BankRuleEventsTracker,
  PdfTemplateEventsTracker,
  PaymentMethodEventsTracker,
  PaymentLinkEventsTracker,
  StripeIntegrationEventsTracker,
  ReportsEventsTracker,
];
