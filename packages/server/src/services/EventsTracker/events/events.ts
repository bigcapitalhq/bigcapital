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
];
