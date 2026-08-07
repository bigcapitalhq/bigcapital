import intl from 'react-intl-universal';
import { useAbilitiesFilter } from '../hooks';
import {
  AbilitySubject,
  SaleEstimateAction,
  SaleReceiptAction,
  SaleInvoiceAction,
  BillAction,
} from './abilityOption';
import type { ItemPaymentTransactionOption } from './types';

export const getItemPaymentTransactions =
  (): ItemPaymentTransactionOption[] => [
    {
      name: 'invoices',
      label: intl.get('invoices'),
      permission: {
        subject: AbilitySubject.Invoice,
        ability: SaleInvoiceAction.View,
      },
    },
    {
      name: 'estimates',
      label: intl.get('estimates'),
      permission: {
        subject: AbilitySubject.Estimate,
        ability: SaleEstimateAction.View,
      },
    },
    {
      name: 'receipts',
      label: intl.get('receipts'),
      permission: {
        subject: AbilitySubject.Receipt,
        ability: SaleReceiptAction.View,
      },
    },
    {
      name: 'bills',
      label: intl.get('bills'),
      permission: {
        subject: AbilitySubject.Bill,
        ability: BillAction.View,
      },
    },
  ];

export const useGetItemPaymentTransactionsMenu = () => {
  const itemTransactionMenu = getItemPaymentTransactions();
  const abilitiesFilter = useAbilitiesFilter();

  return abilitiesFilter(itemTransactionMenu);
};
