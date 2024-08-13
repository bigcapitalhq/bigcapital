// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import {
  SaleInvoiceAction,
  SaleEstimateAction,
  AbilitySubject,
  SaleReceiptAction,
  CustomerAction,
  PaymentReceiveAction,
  BillAction,
  VendorAction,
  PaymentMadeAction,
  AccountAction,
  ManualJournalAction,
  ExpenseAction,
  ItemAction,
  ReportsAction,
} from './abilityOption';

export const accountsReceivable = [
  {
    sectionTitle: <T id={'accounts_receivable_a_r'} />,
    shortcuts: [
      {
        title: <T id={'sales_invoices'} />,
        description: <T id={'tracking_sales_invoices_with_your_customers'} />,
        link: '/invoices',
        subject: AbilitySubject.Invoice,
        ability: SaleInvoiceAction.View,
      },
      {
        title: <T id={'sales_estimates'} />,
        description: <T id={'manage_your_sales_estimates_to_create_quotes'} />,
        link: '/estimates',
        subject: AbilitySubject.Estimate,
        ability: SaleEstimateAction.View,
      },
      {
        title: <T id={'sales_receipts'} />,
        description: <T id={'manage_sales_receipts_for_sales_that_get_paid'} />,
        link: '/receipts',
        subject: AbilitySubject.Receipt,
        ability: SaleReceiptAction.View,
      },
      {
        title: <T id={'customers'} />,
        description: <T id={'manage_the_customers_relations_with_customer'} />,
        link: '/customers',
        subject: AbilitySubject.Customer,
        ability: CustomerAction.View,
      },
      {
        title: <T id={'customers_payments'} />,
        description: (
          <T id={'manage_payment_transactions_from_your_customers'} />
        ),
        link: '/payment-receives',
        subject: AbilitySubject.PaymentReceive,
        ability: PaymentReceiveAction.View,
      },
    ],
  },
];

export const accountsPayable = [
  {
    sectionTitle: <T id={'accounts_payable_a_p'} />,
    shortcuts: [
      {
        title: <T id={'purchase_invoices'} />,
        description: (
          <T id={'manage_the_purchase_invoices_with_your_vendors'} />
        ),
        link: '/bills',
        subject: AbilitySubject.Bill,
        ability: BillAction.View,
      },
      {
        title: <T id={'vendors'} />,
        description: (
          <T id={'manage_the_vendors_relations_with_vendor_relations'} />
        ),
        link: '/vendors',
        subject: AbilitySubject.Vendor,
        ability: VendorAction.View,
      },
      {
        title: <T id={'vendors_payments'} />,
        description: <T id={'manage_payments_transactions_to_your_vendors'} />,
        link: '/payments-made',
        subject: AbilitySubject.PaymentMade,
        ability: PaymentMadeAction.View,
      },
    ],
  },
];

export const financialAccounting = [
  {
    sectionTitle: <T id={'financial_accounting'} />,
    shortcuts: [
      {
        title: <T id={'chart_of_accounts'} />,
        description: (
          <T
            id={
              'manage_your_accounts_chart_to_record_your_transactions_and_categories'
            }
          />
        ),
        link: '/accounts',
        subject: AbilitySubject.Account,
        ability: AccountAction.View,
      },
      {
        title: <T id={'manual_journal'} />,
        description: (
          <T id={'manage_manual_journal_transactions_on_accounts'} />
        ),
        link: '/manual-journals',
        subject: AbilitySubject.ManualJournal,
        ability: ManualJournalAction.View,
      },
      {
        title: <T id={'expenses'} />,
        description: (
          <T id={'track_your_indirect_expenses_under_specific_categories'} />
        ),
        link: '/expenses',
        subject: AbilitySubject.Expense,
        ability: ExpenseAction.View,
      },
      {
        title: <T id={'financial_statements'} />,
        description: (
          <T id={'show_financial_reports_about_your_organization'} />
        ),
        link: '/financial-reports',
        subject: AbilitySubject.Report,
        ability: ReportsAction.ALL,
      },
    ],
  },
];

export const productsServices = [
  {
    sectionTitle: <T id={'products_services_inventory'} />,
    shortcuts: [
      {
        title: <T id={'products_services'} />,
        description: (
          <T id={'manage_your_products_inventory_or_non_inventory'} />
        ),
        link: '/items',
        subject: AbilitySubject.Item,
        ability: ItemAction.View,
      },
      {
        title: <T id={'products_services_categories'} />,
        description: <T id={'group_your_products_and_service'} />,
        link: 'items/categories',
      },
      {
        title: <T id={'inventory_adjustments'} />,
        description: (
          <T id={'manage_your_inventory_adjustment_of_inventory_items'} />
        ),
        link: '/inventory-adjustments',
        subject: AbilitySubject.InventoryAdjustment,
        ability: SaleInvoiceAction.View,
      },
    ],
  },
];
