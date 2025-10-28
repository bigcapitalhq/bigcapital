import { Module } from '@nestjs/common';
import { SaleInvoiceEventsTracker } from './events/SaleInvoicesEventsTracker';
import { SaleEstimateEventsTracker } from './events/SaleEstimateEventsTracker';
import { PaymentMadeEventsTracker } from './events/PaymentMadeEventsTracker';
import { PaymentReceivedEventsTracker } from './events/PaymentReceivedEventsTracker';
import { BillEventsTracker } from './events/BillEventsTracker';
import { AccountEventsTracker } from './events/AccountEventsTracker';
import { ExpenseEventsTracker } from './events/ExpenseEventsTracker';
import { AuthenticationEventsTracker } from './events/AuthenticationEventsTracker';
import { ItemEventsTracker } from './events/ItemEventsTracker';
import { BankTransactionEventsTracker } from './events/BankTransactionEventsTracker';
import { CustomerEventsTracker } from './events/CustomerEventsTracker';
import { VendorEventsTracker } from './events/VendorEventsTracker';
import { ManualJournalEventsTracker } from './events/ManualJournalEventsTracker';
import { BankRuleEventsTracker } from './events/BankRuleEventsTracker';
import { PdfTemplateEventsTracker } from './events/PdfTemplateEventsTracker';
import { PaymentMethodEventsTracker } from './events/PaymentMethodEventsTracker';
import { PaymentLinkEventsTracker } from './events/PaymentLinkEventsTracker';
import { StripeIntegrationEventsTracker } from './events/StripeIntegrationEventsTracker';
import { PostHogModule } from './postHog.module';
import { ReportsEventsTracker } from './events/ReportsEventsTracker';

@Module({
  imports: [PostHogModule],
  providers: [
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
  ],
})
export class EventTrackerModule {}
