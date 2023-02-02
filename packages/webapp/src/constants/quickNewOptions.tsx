// @ts-nocheck
import intl from 'react-intl-universal';
import {
  AbilitySubject,
  SaleInvoiceAction,
  CustomerAction,
  VendorAction,
  ManualJournalAction,
  ExpenseAction,
} from './abilityOption';
import { useAbilitiesFilter } from '../hooks';

export const getQuickNewActions = () => [
  {
    path: 'invoices/new',
    name: intl.get('sale_invoice'),
    permission: {
      subject: AbilitySubject.Invoice,
      ability: SaleInvoiceAction.Create,
    },
  },
  {
    path: 'bills/new',
    name: intl.get('purchase_invoice'),
    permission: {
      subject: AbilitySubject.Invoice,
      ability: SaleInvoiceAction.Create,
    },
  },
  {
    path: 'make-journal-entry',
    name: intl.get('manual_journal'),
    permission: {
      subject: AbilitySubject.ManualJournal,
      ability: ManualJournalAction.Create,
    },
  },
  {
    path: 'expenses/new',
    name: intl.get('expense'),
    permission: {
      subject: AbilitySubject.Expense,
      ability: ExpenseAction.Create,
    },
  },
  {
    path: 'customers/new',
    name: intl.get('customer'),
    permission: {
      subject: AbilitySubject.Customer,
      ability: CustomerAction.Create,
    },
  },
  {
    path: 'vendors/new',
    name: intl.get('vendor'),
    permission: {
      subject: AbilitySubject.Vendor,
      ability: VendorAction.Vendor,
    },
  },
];

/**
 * Retrieve the dashboard quick new menu items.
 */
export const useGetQuickNewMenu = () => {
  const quickNewMenu = getQuickNewActions();
  const abilitiesFilter = useAbilitiesFilter();

  return abilitiesFilter(quickNewMenu);
};
