export const financialReportMenus = [
  {
    sectionTitle: 'Financial Accounting',
    reports: [
      {
        title: 'Balance Sheet Report',
        desc:
          "Reports a company's assets, liabilities and shareholders' equity at a specific point in time with comparison period(s).",
        link: '/financial-reports/balance-sheet',
      },
      {
        title: 'Trial Balance Sheet',
        desc:
          'Summarizes the credit and debit balance of each account in your chart of accounts at a specific point in time.',
        link: '/financial-reports/trial-balance-sheet',
      },
      {
        title: 'Journal Report',
        desc:
          'The debit and credit entries of system transactions, sorted by date.',
        link: '/financial-reports/journal-sheet',
      },
      {
        title: 'Profit/Loss Report',
        desc:
          'Reports the revenues, costs and expenses incurred during a specific point in time with comparison period(s).',
        link: '/financial-reports/profit-loss-sheet',
      },
      {
        title: 'General Ledger Report',
        desc:
          'Reports every transaction going in and out of your accounts and organized by accounts and date to monitoring activity of accounts.',
        link: '/financial-reports/general-ledger',
      },
      {
        title: 'Receivable Aging Summary',
        desc:
          'Summarize total unpaid balances of customers invoices with number of days the unpaid invoice is overdue.',
        link: '/financial-reports/receivable-aging-summary',
      },
      {
        title: 'Payable Aging Summary',
        desc:
          'Summarize total unpaid balances of vendors purchase invoices with the number of days the unpaid invoice is overdue.',
        link: '/financial-reports/payable-aging-summary',
      },
    ],
  },
];

export const SalesAndPurchasesReportMenus = [
  {
    sectionTitle: 'Sales/Purchases Reports',
    reports: [
      {
        title: 'Purchases By Items',
        desc:
          'Shows the average age of unresolved issues for a project or filter. This helps you see whether your backlog is being kept up to date.',
        link: '/financial-reports/purchases-by-items',
      },
      {
        title: 'Sales By Items',
        desc:
          'Summarize the business’s sold items quantity, income and average income rate of each item during a specific point in time.',
        link: '/financial-reports/sales-by-items',
      },
      {
        title: 'Inventory valuation',
        desc:
          'Summarize the business’s purchase items quantity, cost and average cost rate of each item during a specific point in time.',
        link: '/financial-reports/inventory-valuation',
      },
      {
        title: 'Customer Balance summary',
        desc: 'Summerize the total amount of each customer owes your business.',
        link: '/financial-reports/customers-balance-summary',
      },
      {
        title: 'Vendors Balance summary',
        desc: 'Summerize the total amount your business owes each vendor.',
        link: '/financial-reports/vendors-balance-summary',
      },
      {
        title: 'Customers Transactions',
        desc: 'Reports every transaction going in and out of each customer.',
        link: '/financial-reports/transactions-by-customers',
      },
      {
        title: 'Vendors Transactions',
        desc: 'Reports every transaction going in and out of each vendor/supplier.',
        link: '/financial-reports/transactions-by-vendors',
      },
    ],
  },
];
