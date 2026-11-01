import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

const ResumeFeedsBankAccountAlert: LazyExoticComponent<ComponentType<any>> =
  lazy(() =>
    import('./ResumeFeedsBankAccount').then((m) => ({
      default: m.ResumeFeedsBankAccount,
    })),
  );

const PauseFeedsBankAccountAlert: LazyExoticComponent<ComponentType<any>> =
  lazy(() =>
    import('./PauseFeedsBankAccount').then((m) => ({
      default: m.PauseFeedsBankAccount,
    })),
  );

const UncategorizeTransactionsBulkAlert: LazyExoticComponent<
  ComponentType<any>
> = lazy(() =>
  import('./UncategorizeBankTransactionsBulkAlert').then((m) => ({
    default: m.UncategorizeBankTransactionsBulkAlert,
  })),
);

interface BankAccountAlertEntry {
  name: string;
  component: LazyExoticComponent<ComponentType<any>>;
}

/**
 * Bank account alerts.
 */
export const BankAccountAlerts: BankAccountAlertEntry[] = [
  {
    name: 'resume-feeds-syncing-bank-accounnt',
    component: ResumeFeedsBankAccountAlert,
  },
  {
    name: 'pause-feeds-syncing-bank-accounnt',
    component: PauseFeedsBankAccountAlert,
  },
  {
    name: 'uncategorize-transactions-bulk',
    component: UncategorizeTransactionsBulkAlert,
  },
];
