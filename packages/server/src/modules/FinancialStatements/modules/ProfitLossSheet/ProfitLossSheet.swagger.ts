export const ProfitLossSheetResponseExample = {
  query: {
    from_date: '2025-01-01',
    to_date: '2025-06-22',
    number_format: {
      divide_on1000: false,
      negative_format: 'mines',
      show_zero: false,
      format_money: 'total',
      precision: 2,
    },
    basis: 'accrual',
    none_zero: false,
    none_transactions: false,
    display_columns_type: 'total',
    display_columns_by: 'year',
    accounts_ids: [],
    percentage_column: false,
    percentage_row: false,
    percentage_income: false,
    percentage_expense: false,
    previous_period: false,
    previous_period_amount_change: false,
    previous_period_percentage_change: false,
    previous_year: false,
    previous_year_amount_change: false,
    previous_year_percentage_change: false,
  },
  data: [
    {
      id: 'INCOME',
      name: 'Income',
      node_type: 'ACCOUNTS',
      total: {
        amount: 3931,
        formatted_amount: '$3,931.00',
      },
      children: [
        {
          id: 1025,
          name: 'Sales of Product Income',
          node_type: 'ACCOUNT',
          total: {
            amount: 3931,
            formatted_amount: '3,931.00',
          },
        },
        {
          id: 1026,
          name: 'Sales of Service Income',
          node_type: 'ACCOUNT',
          total: {
            amount: 0,
            formatted_amount: '',
          },
        },
        {
          id: 1027,
          name: 'Uncategorized Income',
          node_type: 'ACCOUNT',
          total: {
            amount: 0,
            formatted_amount: '',
          },
        },
      ],
    },
    {
      id: 'COST_OF_SALES',
      name: 'Cost of sales',
      node_type: 'ACCOUNTS',
      total: {
        amount: 800,
        formatted_amount: '$800.00',
      },
      children: [
        {
          id: 1019,
          name: 'Cost of Goods Sold',
          node_type: 'ACCOUNT',
          total: {
            amount: 800,
            formatted_amount: '800.00',
          },
        },
      ],
    },
    {
      id: 'GROSS_PROFIT',
      name: 'GROSS PROFIT',
      node_type: 'EQUATION',
      total: {
        amount: 3131,
        formatted_amount: '$3,131.00',
      },
    },
    {
      id: 'EXPENSES',
      name: 'Expenses',
      node_type: 'ACCOUNTS',
      total: {
        amount: -111563,
        formatted_amount: '-$111,563.00',
      },
      children: [
        {
          id: 1020,
          name: 'Office expenses',
          node_type: 'ACCOUNT',
          total: {
            amount: 0,
            formatted_amount: '',
          },
        },
        {
          id: 1021,
          name: 'Rent',
          node_type: 'ACCOUNT',
          total: {
            amount: -92831,
            formatted_amount: '-92,831.00',
          },
        },
        {
          id: 1023,
          name: 'Bank Fees and Charges',
          node_type: 'ACCOUNT',
          total: {
            amount: -8732,
            formatted_amount: '-8,732.00',
          },
        },
        {
          id: 1024,
          name: 'Depreciation Expense',
          node_type: 'ACCOUNT',
          total: {
            amount: -10000,
            formatted_amount: '-10,000.00',
          },
        },
      ],
    },
    {
      id: 'NET_OPERATING_INCOME',
      name: 'NET OPERATING INCOME',
      node_type: 'EQUATION',
      total: {
        amount: 114694,
        formatted_amount: '$114,694.00',
      },
    },
    {
      id: 'OTHER_INCOME',
      name: 'Other income',
      node_type: 'ACCOUNTS',
      total: {
        amount: 0,
        formatted_amount: '$0.00',
      },
      children: [
        {
          id: 1031,
          name: 'Discount',
          node_type: 'ACCOUNT',
          total: {
            amount: 0,
            formatted_amount: '',
          },
        },
        {
          id: 1033,
          name: 'Other Charges',
          node_type: 'ACCOUNT',
          total: {
            amount: 0,
            formatted_amount: '',
          },
        },
      ],
    },
    {
      id: 'OTHER_EXPENSES',
      name: 'Other expenses',
      node_type: 'ACCOUNTS',
      total: {
        amount: 119149,
        formatted_amount: '$119,149.00',
      },
      children: [
        {
          id: 1018,
          name: 'Other Expenses',
          node_type: 'ACCOUNT',
          total: {
            amount: -1243,
            formatted_amount: '-1,243.00',
          },
        },
        {
          id: 1022,
          name: 'Exchange Gain or Loss',
          node_type: 'ACCOUNT',
          total: {
            amount: 123123,
            formatted_amount: '123,123.00',
          },
        },
        {
          id: 1032,
          name: 'Purchase Discount',
          node_type: 'ACCOUNT',
          total: {
            amount: -2731,
            formatted_amount: '-2,731.00',
          },
        },
      ],
    },
    {
      id: 'NET_INCOME',
      name: 'NET INCOME',
      node_type: 'EQUATION',
      total: {
        amount: -4455,
        formatted_amount: '-$4,455.00',
      },
    },
  ],
  meta: {
    organization_name: 'BIGCAPITAL, INC',
    base_currency: 'USD',
    date_format: 'DD MMM yyyy',
    is_cost_compute_running: false,
    sheet_name: 'Cashflow Statement',
    formatted_from_date: '2025/01/01',
    formatted_to_date: '2025/06/22',
    formatted_date_range: 'From 2025/01/01 | To 2025/06/22',
  },
};
