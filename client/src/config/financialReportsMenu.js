import React from 'react';
import { FormattedMessage as T } from 'react-intl';

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
      },
      {
        title: <T id={'trial_balance_sheet'} />,
        desc: (
          <T id={'summarizes_the_credit_and_debit_balance_of_each_account'} />
        ),
        link: '/financial-reports/trial-balance-sheet',
      },
      {
        title: <T id={'profit_loss_report'} />,
        desc: <T id={'reports_the_revenues_costs_and_expenses'} />,
        link: '/financial-reports/profit-loss-sheet',
      },
      {
        title: <T id={'cash_flow_statement'} />,
        desc: (
          <T id={'reports_inflow_and_outflow_of_cash_and_cash_equivalents'} />
        ),
        link: '/financial-reports/cash-flow',
      },
      {
        title: <T id={'journal_report'} />,
        desc: <T id={'the_debit_and_credit_entries_of_system_transactions'} />,
        link: '/financial-reports/journal-sheet',
      },
      {
        title: <T id={'general_ledger_report'} />,
        desc: <T id={'reports_every_transaction_going_in_and_out_of_your'} />,
        link: '/financial-reports/general-ledger',
      },
      {
        title: <T id={'receivable_aging_summary'} />,
        desc: (
          <T id={'summarize_total_unpaid_balances_of_customers_invoices'} />
        ),
        link: '/financial-reports/receivable-aging-summary',
      },
      {
        title: <T id={'payable_aging_summary'} />,
        desc: <T id={'summarize_total_unpaid_balances_of_vendors_purchase'} />,
        link: '/financial-reports/payable-aging-summary',
      },
    ],
  },
];

export const SalesAndPurchasesReportMenus = [
  {
    sectionTitle: <T id={'sales_purchases_reports'} />,
    reports: [
      {
        title: <T id={'purchases_by_items'} />,
        desc: (
          <T
            id={
              'shows_the_average_age_of_unresolved_issues_for_a_project_or_filter'
            }
          />
        ),
        link: '/financial-reports/purchases-by-items',
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
      },
      {
        title: <T id={'inventory_valuation'} />,
        desc: (
          <T
            id={
              'summarize_the_business_s_purchase_items_quantity_cost_and_average'
            }
          />
        ),
        link: '/financial-reports/inventory-valuation',
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
      },
      {
        title: <T id={'vendors_balance_summary'} />,
        desc: 'summerize_the_total_amount_your_business_owes_each_vendor',
        link: '/financial-reports/vendors-balance-summary',
      },
      {
        title: <T id={'customers_transactions'} />,
        desc: (
          <T
            id={'reports_every_transaction_going_in_and_out_of_each_customer'}
          />
        ),
        link: '/financial-reports/transactions-by-customers',
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
      },
      {
        title: <T id={'inventory_item_details'} />,
        desc: (
          <T id={'reports_every_transaction_going_in_and_out_of_your_items'} />
        ),
        link: '/financial-reports/inventory-item-details',
      },
    ],
  },
];
