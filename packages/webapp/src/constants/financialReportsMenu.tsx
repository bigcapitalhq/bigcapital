// @ts-nocheck
import React from 'react';
import { FormattedMessage as T } from '@/components';
import { ReportsAction, AbilitySubject } from '@/constants/abilityOption';

export const financialReportMenus = [
  {
    sectionTitle: <T id={'financial_accounting'} />,
    reports: [
      {
        title: <T id={'balance_sheet_report'} />,
        desc: (
          <T id={'reports_a_company_s_assets_liabilities_and_shareholders'} />
        ),
        link: '/financial-reports/balance-sheet',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_BALANCE_SHEET,
      },
      {
        title: <T id={'trial_balance_sheet'} />,
        desc: (
          <T id={'summarizes_the_credit_and_debit_balance_of_each_account'} />
        ),
        link: '/financial-reports/trial-balance-sheet',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_TRIAL_BALANCE_SHEET,
      },
      {
        title: <T id={'profit_loss_report'} />,
        desc: <T id={'reports_the_revenues_costs_and_expenses'} />,
        link: '/financial-reports/profit-loss-sheet',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_PROFIT_LOSS,
      },
      {
        title: <T id={'cash_flow_statement'} />,
        desc: (
          <T id={'reports_inflow_and_outflow_of_cash_and_cash_equivalents'} />
        ),
        link: '/financial-reports/cash-flow',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_CASHFLOW,
      },
      {
        title: <T id={'journal_report'} />,
        desc: <T id={'the_debit_and_credit_entries_of_system_transactions'} />,
        link: '/financial-reports/journal-sheet',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_JOURNAL,
      },
      {
        title: <T id={'general_ledger_report'} />,
        desc: <T id={'reports_every_transaction_going_in_and_out_of_your'} />,
        link: '/financial-reports/general-ledger',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_GENERAL_LEDGET,
      },
      {
        title: <T id={'receivable_aging_summary'} />,
        desc: (
          <T id={'summarize_total_unpaid_balances_of_customers_invoices'} />
        ),
        link: '/financial-reports/receivable-aging-summary',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_AR_AGING_SUMMARY,
      },
      {
        title: <T id={'payable_aging_summary'} />,
        desc: <T id={'summarize_total_unpaid_balances_of_vendors_purchase'} />,
        link: '/financial-reports/payable-aging-summary',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_AP_AGING_SUMMARY,
      },
      {
        title: <T id={'report.balance_sheet_comparison.title'} />,
        desc: <T id={'report.balance_sheet_comparison.desc'} />,
        link: 'financial-reports/balance-sheet?previousYear=true&previousYearAmountChange=true&previousYearPercentageChange=true',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_BALANCE_SHEET,
      },
      {
        title: <T id={'report.profit_loss_sheet_comparison.title'} />,
        desc: <T id={'report.profit_loss_sheet_comparison.desc'} />,
        link: '/financial-reports/profit-loss-sheet?previousYear=true&previousYearAmountChange=true&previousYearPercentageChange=true',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_PROFIT_LOSS,
      },
    ],
  },
  {
    sectionTitle: <T id={'sales_purchases_reports'} />,
    reports: [
      {
        title: <T id={'purchases_by_items'} />,
        desc: (
          <T
            id={
              'summarize_the_business_s_purchase_items_quantity_cost_and_average'
            }
          />
        ),
        link: '/financial-reports/purchases-by-items',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_PURCHASES_BY_ITEMS,
      },
      {
        title: <T id={'sales_by_items'} />,
        desc: (
          <T
            id={
              'summarize_the_business_s_sold_items_quantity_income_and_average_income_rate'
            }
          />
        ),
        link: '/financial-reports/sales-by-items',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_SALES_BY_ITEMS,
      },
      {
        title: <T id={'customers_balance_summary'} />,
        desc: (
          <T
            id={
              'summerize_the_total_amount_of_each_customer_owes_your_business'
            }
          />
        ),
        link: '/financial-reports/customers-balance-summary',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_CUSTOMERS_SUMMARY_BALANCE,
      },
      {
        title: <T id={'vendors_balance_summary'} />,
        desc: (
          <T id={'summerize_the_total_amount_your_business_owes_each_vendor'} />
        ),
        link: '/financial-reports/vendors-balance-summary',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_VENDORS_SUMMARY_BALANCE,
      },
      {
        title: <T id={'customers_transactions'} />,
        desc: (
          <T
            id={'reports_every_transaction_going_in_and_out_of_each_customer'}
          />
        ),
        link: '/financial-reports/transactions-by-customers',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_CUSTOMERS_TRANSACTIONS,
      },
      {
        title: <T id={'vendors_transactions'} />,
        desc: (
          <T
            id={
              'reports_every_transaction_going_in_and_out_of_each_vendor_supplier'
            }
          />
        ),
        link: '/financial-reports/transactions-by-vendors',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_VENDORS_TRANSACTIONS,
      },
      {
        title: <T id={'inventory_item_details'} />,
        desc: (
          <T id={'reports_every_transaction_going_in_and_out_of_your_items'} />
        ),
        link: '/financial-reports/inventory-item-details',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_INVENTORY_ITEM_DETAILS,
      },
    ],
  },
  {
    sectionTitle: 'Taxes',
    reports: [
      {
        title: 'Sales Tax Liability Summary',
        desc: 'Reports the total amount of sales tax collected from customers',
        link: '/financial-reports/sales-tax-liability-summary',
        subject: AbilitySubject.Report,
        ability: ReportsAction.READ_SALES_TAX_LIABILITY_SUMMARY,
      },
    ],
  },
];
