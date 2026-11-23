export const BudgetVsActualResponseExample = {
  data: {
    periods: [
      {
        key: '2024-01',
        label: 'Jan 2024',
        fromDate: '2024-01-01',
        toDate: '2024-01-31',
      },
      {
        key: '2024-02',
        label: 'Feb 2024',
        fromDate: '2024-02-01',
        toDate: '2024-02-29',
      },
    ],
    accounts: [
      {
        accountId: 1,
        accountCode: '4000',
        accountName: 'Sales',
        accountType: 'income',
        cells: [
          {
            budget: 150000,
            formattedBudget: '$150,000.00',
            actual: 159000,
            formattedActual: '$159,000.00',
            variance: 9000,
            formattedVariance: '$9,000.00',
            percentage: 0.06,
            formattedPercentage: '%6.00',
          },
        ],
        total: {
          budget: 150000,
          formattedBudget: '$150,000.00',
          actual: 159000,
          formattedActual: '$159,000.00',
          variance: 9000,
          formattedVariance: '$9,000.00',
          percentage: 0.06,
          formattedPercentage: '%6.00',
        },
      },
    ],
    totals: {
      periods: [],
      total: {
        budget: 150000,
        formattedBudget: '$150,000.00',
        actual: 159000,
        formattedActual: '$159,000.00',
        variance: 9000,
        formattedVariance: '$9,000.00',
        percentage: 0.06,
        formattedPercentage: '%6.00',
      },
    },
  },
  query: {
    budgetId: 1,
    fromDate: '2024-01-01',
    toDate: '2024-12-31',
    displayColumnsBy: 'month',
  },
  meta: {
    organizationName: 'Bigcapital, Inc.',
    baseCurrency: 'USD',
    dateFormat: 'YYYY MMM DD',
    sheetName: 'Budget vs actual',
    budgetId: 1,
    budgetName: 'Annual budget 2024',
    formattedFromDate: '2024 Jan 01',
    formattedToDate: '2024 Dec 31',
    formattedDateRange: 'From 2024 Jan 01 | To 2024 Dec 31',
  },
};
