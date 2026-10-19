import { AccountingBasis } from '@/common/types/AccountingBasis';

export const ProfitLossSheetResponseExample = {
  query: {
    fromDate: '2025-01-01',
    toDate: '2025-06-22',
    numberFormat: {
      divideOn1000: false,
      negativeFormat: 'mines',
      showZero: false,
      formatMoney: 'total',
      precision: 2,
    },
    basis: AccountingBasis.Accrual,
    noneZero: false,
    noneTransactions: false,
    displayColumnsType: 'total',
    displayColumnsBy: 'year',
    accountsIds: [],
    percentageColumn: false,
    percentageRow: false,
    percentageIncome: false,
    percentageExpense: false,
    previousPeriod: false,
    previousPeriodAmountChange: false,
    previousPeriodPercentageChange: false,
    previousYear: false,
    previousYearAmountChange: false,
    previousYearPercentageChange: false,
  },
  data: [
    {
      id: 'INCOME',
      name: 'Income',
      nodeType: 'ACCOUNTS',
      total: {
        amount: 3931,
        formattedAmount: '$3,931.00',
      },
      children: [
        {
          id: 1025,
          name: 'Sales of Product Income',
          nodeType: 'ACCOUNT',
          total: {
            amount: 3931,
            formattedAmount: '3,931.00',
          },
        },
        {
          id: 1026,
          name: 'Sales of Service Income',
          nodeType: 'ACCOUNT',
          total: {
            amount: 0,
            formattedAmount: '',
          },
        },
        {
          id: 1027,
          name: 'Uncategorized Income',
          nodeType: 'ACCOUNT',
          total: {
            amount: 0,
            formattedAmount: '',
          },
        },
      ],
    },
    {
      id: 'COST_OF_SALES',
      name: 'Cost of sales',
      nodeType: 'ACCOUNTS',
      total: {
        amount: 800,
        formattedAmount: '$800.00',
      },
      children: [
        {
          id: 1019,
          name: 'Cost of Goods Sold',
          nodeType: 'ACCOUNT',
          total: {
            amount: 800,
            formattedAmount: '800.00',
          },
        },
      ],
    },
    {
      id: 'GROSS_PROFIT',
      name: 'GROSS PROFIT',
      nodeType: 'EQUATION',
      total: {
        amount: 3131,
        formattedAmount: '$3,131.00',
      },
    },
    {
      id: 'EXPENSES',
      name: 'Expenses',
      nodeType: 'ACCOUNTS',
      total: {
        amount: -111563,
        formattedAmount: '-$111,563.00',
      },
      children: [
        {
          id: 1020,
          name: 'Office expenses',
          nodeType: 'ACCOUNT',
          total: {
            amount: 0,
            formattedAmount: '',
          },
        },
        {
          id: 1021,
          name: 'Rent',
          nodeType: 'ACCOUNT',
          total: {
            amount: -92831,
            formattedAmount: '-92,831.00',
          },
        },
        {
          id: 1023,
          name: 'Bank Fees and Charges',
          nodeType: 'ACCOUNT',
          total: {
            amount: -8732,
            formattedAmount: '-8,732.00',
          },
        },
        {
          id: 1024,
          name: 'Depreciation Expense',
          nodeType: 'ACCOUNT',
          total: {
            amount: -10000,
            formattedAmount: '-10,000.00',
          },
        },
      ],
    },
    {
      id: 'NET_OPERATING_INCOME',
      name: 'NET OPERATING INCOME',
      nodeType: 'EQUATION',
      total: {
        amount: 114694,
        formattedAmount: '$114,694.00',
      },
    },
    {
      id: 'OTHER_INCOME',
      name: 'Other income',
      nodeType: 'ACCOUNTS',
      total: {
        amount: 0,
        formattedAmount: '$0.00',
      },
      children: [
        {
          id: 1031,
          name: 'Discount',
          nodeType: 'ACCOUNT',
          total: {
            amount: 0,
            formattedAmount: '',
          },
        },
        {
          id: 1033,
          name: 'Other Charges',
          nodeType: 'ACCOUNT',
          total: {
            amount: 0,
            formattedAmount: '',
          },
        },
      ],
    },
    {
      id: 'OTHER_EXPENSES',
      name: 'Other expenses',
      nodeType: 'ACCOUNTS',
      total: {
        amount: 119149,
        formattedAmount: '$119,149.00',
      },
      children: [
        {
          id: 1018,
          name: 'Other Expenses',
          nodeType: 'ACCOUNT',
          total: {
            amount: -1243,
            formattedAmount: '-1,243.00',
          },
        },
        {
          id: 1022,
          name: 'Exchange Gain or Loss',
          nodeType: 'ACCOUNT',
          total: {
            amount: 123123,
            formattedAmount: '123,123.00',
          },
        },
        {
          id: 1032,
          name: 'Purchase Discount',
          nodeType: 'ACCOUNT',
          total: {
            amount: -2731,
            formattedAmount: '-2,731.00',
          },
        },
      ],
    },
    {
      id: 'NET_INCOME',
      name: 'NET INCOME',
      nodeType: 'EQUATION',
      total: {
        amount: -4455,
        formattedAmount: '-$4,455.00',
      },
    },
  ],
  meta: {
    organizationName: 'BIGCAPITAL, INC',
    baseCurrency: 'USD',
    dateFormat: 'DD MMM yyyy',
    isCostComputeRunning: false,
    sheetName: 'Cashflow Statement',
    formattedFromDate: '2025/01/01',
    formattedToDate: '2025/06/22',
    formattedDateRange: 'From 2025/01/01 | To 2025/06/22',
  },
};
