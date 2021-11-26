import intl from 'react-intl-universal';
import {
  AbilitySubject,
  Invoice_Abilities,
  Customer_Abilities,
  Vendor_Abilities,
  Manual_Journal_Abilities,
  Expense_Abilities,
} from '../common/abilityOption';
import { useAbilitiesFilter } from '../hooks';

export const getQuickNewActions = () => [
  {
    path: 'invoices/new',
    name: intl.get('sale_invoice'),
    permission: {
      subject: AbilitySubject.Invoice,
      ability: Invoice_Abilities.Create,
    },
  },
  {
    path: 'bills/new',
    name: intl.get('purchase_invoice'),
    permission: {
      subject: AbilitySubject.Invoice,
      ability: Invoice_Abilities.Create,
    },
  },
  {
    path: 'make-journal-entry',
    name: intl.get('manual_journal'),
    permission: {
      subject: AbilitySubject.ManualJournal,
      ability: Manual_Journal_Abilities.Create,
    },
  },
  {
    path: 'expenses/new',
    name: intl.get('expense'),
    permission: {
      subject: AbilitySubject.Expense,
      ability: Expense_Abilities.Create,
    },
  },
  {
    path: 'customers/new',
    name: intl.get('customer'),
    permission: {
      subject: AbilitySubject.Customer,
      ability: Customer_Abilities.Create,
    },
  },
  {
    path: 'vendors/new',
    name: intl.get('vendor'),
    permission: {
      subject: AbilitySubject.Vendor,
      ability: Vendor_Abilities.Vendor,
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
