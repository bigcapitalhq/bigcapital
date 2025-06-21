export const BalanceSheetResponseExample = {
  query: {
    display_columns_type: 'total',
    display_columns_by: 'year',
    from_date: '2025-01-01',
    to_date: '2025-06-16',
    number_format: {
      precision: 2,
      divide_on1000: false,
      show_zero: false,
      format_money: 'total',
      negative_format: 'mines',
    },
    none_zero: false,
    none_transactions: false,
    basis: 'cash',
    account_ids: [],
    percentage_of_column: false,
    percentage_of_row: false,
    previous_period: false,
    previous_period_amount_change: false,
    previous_period_percentage_change: false,
    previous_year: false,
    previous_year_amount_change: false,
    previous_year_percentage_change: false,
  },
  data: [
    {
      name: 'Assets',
      id: 'ASSETS',
      node_type: 'AGGREGATE',
      type: 'AGGREGATE',
      total: {
        amount: -122623,
        formatted_amount: '-$122,623.00',
        currency_code: 'USD',
      },
      children: [
        {
          name: 'Current Asset',
          id: 'CURRENT_ASSETS',
          node_type: 'AGGREGATE',
          type: 'AGGREGATE',
          total: {
            amount: -122623,
            formatted_amount: '-$122,623.00',
            currency_code: 'USD',
          },
          children: [
            {
              name: 'Cash and cash equivalents',
              id: 'CASH_EQUIVALENTS',
              node_type: 'AGGREGATE',
              type: 'AGGREGATE',
              total: {
                amount: -500,
                formatted_amount: '-$500.00',
                currency_code: 'USD',
              },
              children: [
                {
                  id: 1002,
                  index: 1,
                  name: 'Undeposited Funds',
                  code: '10003',
                  total: {
                    amount: 0,
                    formatted_amount: '',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
                {
                  id: 1003,
                  index: 1,
                  name: 'Petty Cash',
                  code: '10004',
                  total: {
                    amount: 0,
                    formatted_amount: '',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
                {
                  id: 1000,
                  index: 1,
                  name: 'Bank Account',
                  code: '10001',
                  total: {
                    amount: -500,
                    formatted_amount: '-500.00',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
                {
                  id: 1001,
                  index: 1,
                  name: 'Saving Bank Account',
                  code: '10002',
                  total: {
                    amount: 0,
                    formatted_amount: '',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
                {
                  id: 1034,
                  index: null,
                  name: 'Chase - Plaid Checking',
                  code: '',
                  total: {
                    amount: 0,
                    formatted_amount: '',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
              ],
            },
            {
              name: 'Accounts Receivable',
              id: 'ACCOUNTS_RECEIVABLE',
              node_type: 'AGGREGATE',
              type: 'AGGREGATE',
              total: {
                amount: 0,
                formatted_amount: '$0.00',
                currency_code: 'USD',
              },
              children: [
                {
                  id: 1006,
                  index: 1,
                  name: 'Accounts Receivable (A/R)',
                  code: '10007',
                  total: {
                    amount: 0,
                    formatted_amount: '',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
              ],
            },
            {
              name: 'Inventory',
              id: 'INVENTORY',
              node_type: 'AGGREGATE',
              type: 'AGGREGATE',
              total: {
                amount: 1000,
                formatted_amount: '$1,000.00',
                currency_code: 'USD',
              },
              children: [
                {
                  id: 1007,
                  index: 1,
                  name: 'Inventory Asset',
                  code: '10008',
                  total: {
                    amount: 1000,
                    formatted_amount: '1,000.00',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
              ],
            },
            {
              name: 'Other current assets',
              id: 'OTHER_CURRENT_ASSET',
              node_type: 'AGGREGATE',
              type: 'AGGREGATE',
              total: {
                amount: -123123,
                formatted_amount: '-$123,123.00',
                currency_code: 'USD',
              },
              children: [
                {
                  id: 1030,
                  index: 1,
                  name: 'Prepaid Expenses',
                  code: '100010',
                  total: {
                    amount: -123123,
                    formatted_amount: '-123,123.00',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
              ],
            },
          ],
        },
        {
          name: 'Fixed Asset',
          id: 'FIXED_ASSET',
          node_type: 'AGGREGATE',
          type: 'AGGREGATE',
          total: {
            amount: 0,
            formatted_amount: '$0.00',
            currency_code: 'USD',
          },
          children: [
            {
              id: 1004,
              index: 1,
              name: 'Computer Equipment',
              code: '10005',
              total: {
                amount: 0,
                formatted_amount: '',
                currency_code: 'USD',
              },
              node_type: 'ACCOUNT',
              children: [],
            },
            {
              id: 1005,
              index: 1,
              name: 'Office Equipment',
              code: '10006',
              total: {
                amount: 0,
                formatted_amount: '',
                currency_code: 'USD',
              },
              node_type: 'ACCOUNT',
              children: [],
            },
          ],
        },
        {
          name: 'Non-Current Assets',
          id: 'NON_CURRENT_ASSET',
          node_type: 'AGGREGATE',
          type: 'AGGREGATE',
          total: {
            amount: 0,
            formatted_amount: '$0.00',
            currency_code: 'USD',
          },
          children: [],
        },
      ],
    },
    {
      name: 'Liabilities and Equity',
      id: 'LIABILITY_EQUITY',
      node_type: 'AGGREGATE',
      type: 'AGGREGATE',
      total: {
        amount: -122623,
        formatted_amount: '-$122,623.00',
        currency_code: 'USD',
      },
      children: [
        {
          name: 'Liabilities',
          id: 'LIABILITY',
          node_type: 'AGGREGATE',
          type: 'AGGREGATE',
          total: {
            amount: -8700,
            formatted_amount: '-$8,700.00',
            currency_code: 'USD',
          },
          children: [
            {
              name: 'Current Liabilties',
              id: 'CURRENT_LIABILITY',
              node_type: 'AGGREGATE',
              type: 'AGGREGATE',
              total: {
                amount: -8700,
                formatted_amount: '-$8,700.00',
                currency_code: 'USD',
              },
              children: [
                {
                  id: 1008,
                  index: 1,
                  name: 'Accounts Payable (A/P)',
                  code: '20001',
                  total: {
                    amount: 1300,
                    formatted_amount: '1,300.00',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
                {
                  id: 1013,
                  index: 1,
                  name: 'Tax Payable',
                  code: '20006',
                  total: {
                    amount: 0,
                    formatted_amount: '',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
                {
                  id: 1009,
                  index: 1,
                  name: 'Owner A Drawings',
                  code: '20002',
                  total: {
                    amount: 0,
                    formatted_amount: '',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
                {
                  id: 1010,
                  index: 1,
                  name: 'Loan',
                  code: '20003',
                  total: {
                    amount: -10000,
                    formatted_amount: '-10,000.00',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
                {
                  id: 1011,
                  index: 1,
                  name: 'Opening Balance Liabilities',
                  code: '20004',
                  total: {
                    amount: 0,
                    formatted_amount: '',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
                {
                  id: 1012,
                  index: 1,
                  name: 'Revenue Received in Advance',
                  code: '20005',
                  total: {
                    amount: 0,
                    formatted_amount: '',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
                {
                  id: 1029,
                  index: 1,
                  name: 'Unearned Revenue',
                  code: '50005',
                  total: {
                    amount: 0,
                    formatted_amount: '',
                    currency_code: 'USD',
                  },
                  node_type: 'ACCOUNT',
                  children: [],
                },
              ],
            },
            {
              name: 'Long-Term Liabilities',
              id: 'LOGN_TERM_LIABILITY',
              node_type: 'AGGREGATE',
              type: 'AGGREGATE',
              total: {
                amount: 0,
                formatted_amount: '$0.00',
                currency_code: 'USD',
              },
              children: [],
            },
            {
              name: 'Non-Current Liabilities',
              id: 'NON_CURRENT_LIABILITY',
              node_type: 'AGGREGATE',
              type: 'AGGREGATE',
              total: {
                amount: 0,
                formatted_amount: '$0.00',
                currency_code: 'USD',
              },
              children: [],
            },
          ],
        },
        {
          name: 'Equity',
          id: 'EQUITY',
          node_type: 'AGGREGATE',
          type: 'AGGREGATE',
          total: {
            amount: -113923,
            formatted_amount: '-$113,923.00',
            currency_code: 'USD',
          },
          children: [
            {
              id: 1014,
              index: 1,
              name: 'Retained Earnings',
              code: '30001',
              total: {
                amount: 0,
                formatted_amount: '',
                currency_code: 'USD',
              },
              node_type: 'ACCOUNT',
              children: [],
            },
            {
              id: 1015,
              index: 1,
              name: 'Opening Balance Equity',
              code: '30002',
              total: {
                amount: 0,
                formatted_amount: '',
                currency_code: 'USD',
              },
              node_type: 'ACCOUNT',
              children: [],
            },
            {
              id: 1016,
              index: 1,
              name: "Owner's Equity",
              code: '30003',
              total: {
                amount: 0,
                formatted_amount: '',
                currency_code: 'USD',
              },
              node_type: 'ACCOUNT',
              children: [],
            },
            {
              id: 1017,
              index: 1,
              name: 'Drawings',
              code: '30003',
              total: {
                amount: 0,
                formatted_amount: '',
                currency_code: 'USD',
              },
              node_type: 'ACCOUNT',
              children: [],
            },
            {
              id: 'NET_INCOME',
              name: 'Net Income',
              node_type: 'NET_INCOME',
              total: {
                amount: -113923,
                formatted_amount: '-$113,923.00',
                currency_code: 'USD',
              },
              children: [],
            },
          ],
        },
      ],
    },
  ],
  meta: {
    organization_name: 'BIGCAPITAL, INC',
    base_currency: 'USD',
    date_format: 'DD MMM yyyy',
    is_cost_compute_running: false,
    sheet_name: 'Balance Sheet Statement',
    formatted_as_date: '2025/06/16',
    formatted_date_range: 'As 2025/06/16',
  },
};

export const BalanceSheetTableResponseExample = {
  table: {
    columns: [
      {
        key: 'name',
        label: 'Account name',
        cell_index: 0,
      },
      {
        key: 'total',
        label: 'Total',
        children: [],
        cell_index: 1,
      },
    ],
    rows: [
      {
        cells: [
          {
            key: 'name',
            value: 'Assets',
          },
          {
            key: 'total',
            value: '-$122,623.00',
          },
        ],
        row_types: ['AGGREGATE'],
        id: 'ASSETS',
        children: [
          {
            cells: [
              {
                key: 'name',
                value: 'Current Asset',
              },
              {
                key: 'total',
                value: '-$122,623.00',
              },
            ],
            row_types: ['AGGREGATE'],
            id: 'CURRENT_ASSETS',
            children: [
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Cash and cash equivalents',
                  },
                  {
                    key: 'total',
                    value: '-$500.00',
                  },
                ],
                row_types: ['AGGREGATE'],
                id: 'CASH_EQUIVALENTS',
                children: [
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Undeposited Funds',
                      },
                      {
                        key: 'total',
                        value: '',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1002,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Petty Cash',
                      },
                      {
                        key: 'total',
                        value: '',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1003,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Bank Account',
                      },
                      {
                        key: 'total',
                        value: '-500.00',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1000,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Saving Bank Account',
                      },
                      {
                        key: 'total',
                        value: '',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1001,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Chase - Plaid Checking',
                      },
                      {
                        key: 'total',
                        value: '',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1034,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Total Cash and cash equivalents',
                      },
                      {
                        key: 'total',
                        value: '-$500.00',
                      },
                    ],
                    row_types: ['TOTAL'],
                    id: 'CASH_EQUIVALENTS',
                  },
                ],
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Accounts Receivable',
                  },
                  {
                    key: 'total',
                    value: '$0.00',
                  },
                ],
                row_types: ['AGGREGATE'],
                id: 'ACCOUNTS_RECEIVABLE',
                children: [
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Accounts Receivable (A/R)',
                      },
                      {
                        key: 'total',
                        value: '',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1006,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Total Accounts Receivable',
                      },
                      {
                        key: 'total',
                        value: '$0.00',
                      },
                    ],
                    row_types: ['TOTAL'],
                    id: 'ACCOUNTS_RECEIVABLE',
                  },
                ],
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Inventory',
                  },
                  {
                    key: 'total',
                    value: '$1,000.00',
                  },
                ],
                row_types: ['AGGREGATE'],
                id: 'INVENTORY',
                children: [
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Inventory Asset',
                      },
                      {
                        key: 'total',
                        value: '1,000.00',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1007,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Total Inventory',
                      },
                      {
                        key: 'total',
                        value: '$1,000.00',
                      },
                    ],
                    row_types: ['TOTAL'],
                    id: 'INVENTORY',
                  },
                ],
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Other current assets',
                  },
                  {
                    key: 'total',
                    value: '-$123,123.00',
                  },
                ],
                row_types: ['AGGREGATE'],
                id: 'OTHER_CURRENT_ASSET',
                children: [
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Prepaid Expenses',
                      },
                      {
                        key: 'total',
                        value: '-123,123.00',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1030,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Total Other current assets',
                      },
                      {
                        key: 'total',
                        value: '-$123,123.00',
                      },
                    ],
                    row_types: ['TOTAL'],
                    id: 'OTHER_CURRENT_ASSET',
                  },
                ],
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Total Current Asset',
                  },
                  {
                    key: 'total',
                    value: '-$122,623.00',
                  },
                ],
                row_types: ['TOTAL'],
                id: 'CURRENT_ASSETS',
              },
            ],
          },
          {
            cells: [
              {
                key: 'name',
                value: 'Fixed Asset',
              },
              {
                key: 'total',
                value: '$0.00',
              },
            ],
            row_types: ['AGGREGATE'],
            id: 'FIXED_ASSET',
            children: [
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Computer Equipment',
                  },
                  {
                    key: 'total',
                    value: '',
                  },
                ],
                row_types: ['ACCOUNT'],
                id: 1004,
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Office Equipment',
                  },
                  {
                    key: 'total',
                    value: '',
                  },
                ],
                row_types: ['ACCOUNT'],
                id: 1005,
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Total Fixed Asset',
                  },
                  {
                    key: 'total',
                    value: '$0.00',
                  },
                ],
                row_types: ['TOTAL'],
                id: 'FIXED_ASSET',
              },
            ],
          },
          {
            cells: [
              {
                key: 'name',
                value: 'Non-Current Assets',
              },
              {
                key: 'total',
                value: '$0.00',
              },
            ],
            row_types: ['AGGREGATE'],
            id: 'NON_CURRENT_ASSET',
          },
          {
            cells: [
              {
                key: 'name',
                value: 'Total Assets',
              },
              {
                key: 'total',
                value: '-$122,623.00',
              },
            ],
            row_types: ['TOTAL'],
            id: 'ASSETS',
          },
        ],
      },
      {
        cells: [
          {
            key: 'name',
            value: 'Liabilities and Equity',
          },
          {
            key: 'total',
            value: '-$122,623.00',
          },
        ],
        row_types: ['AGGREGATE'],
        id: 'LIABILITY_EQUITY',
        children: [
          {
            cells: [
              {
                key: 'name',
                value: 'Liabilities',
              },
              {
                key: 'total',
                value: '-$8,700.00',
              },
            ],
            row_types: ['AGGREGATE'],
            id: 'LIABILITY',
            children: [
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Current Liabilties',
                  },
                  {
                    key: 'total',
                    value: '-$8,700.00',
                  },
                ],
                row_types: ['AGGREGATE'],
                id: 'CURRENT_LIABILITY',
                children: [
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Accounts Payable (A/P)',
                      },
                      {
                        key: 'total',
                        value: '1,300.00',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1008,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Tax Payable',
                      },
                      {
                        key: 'total',
                        value: '',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1013,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Owner A Drawings',
                      },
                      {
                        key: 'total',
                        value: '',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1009,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Loan',
                      },
                      {
                        key: 'total',
                        value: '-10,000.00',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1010,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Opening Balance Liabilities',
                      },
                      {
                        key: 'total',
                        value: '',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1011,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Revenue Received in Advance',
                      },
                      {
                        key: 'total',
                        value: '',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1012,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Unearned Revenue',
                      },
                      {
                        key: 'total',
                        value: '',
                      },
                    ],
                    row_types: ['ACCOUNT'],
                    id: 1029,
                  },
                  {
                    cells: [
                      {
                        key: 'name',
                        value: 'Total Current Liabilties',
                      },
                      {
                        key: 'total',
                        value: '-$8,700.00',
                      },
                    ],
                    row_types: ['TOTAL'],
                    id: 'CURRENT_LIABILITY',
                  },
                ],
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Long-Term Liabilities',
                  },
                  {
                    key: 'total',
                    value: '$0.00',
                  },
                ],
                row_types: ['AGGREGATE'],
                id: 'LOGN_TERM_LIABILITY',
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Non-Current Liabilities',
                  },
                  {
                    key: 'total',
                    value: '$0.00',
                  },
                ],
                row_types: ['AGGREGATE'],
                id: 'NON_CURRENT_LIABILITY',
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Total Liabilities',
                  },
                  {
                    key: 'total',
                    value: '-$8,700.00',
                  },
                ],
                row_types: ['TOTAL'],
                id: 'LIABILITY',
              },
            ],
          },
          {
            cells: [
              {
                key: 'name',
                value: 'Equity',
              },
              {
                key: 'total',
                value: '-$113,923.00',
              },
            ],
            row_types: ['AGGREGATE'],
            id: 'EQUITY',
            children: [
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Retained Earnings',
                  },
                  {
                    key: 'total',
                    value: '',
                  },
                ],
                row_types: ['ACCOUNT'],
                id: 1014,
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Opening Balance Equity',
                  },
                  {
                    key: 'total',
                    value: '',
                  },
                ],
                row_types: ['ACCOUNT'],
                id: 1015,
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: "Owner's Equity",
                  },
                  {
                    key: 'total',
                    value: '',
                  },
                ],
                row_types: ['ACCOUNT'],
                id: 1016,
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Drawings',
                  },
                  {
                    key: 'total',
                    value: '',
                  },
                ],
                row_types: ['ACCOUNT'],
                id: 1017,
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Net Income',
                  },
                  {
                    key: 'total',
                    value: '-$113,923.00',
                  },
                ],
                row_types: ['NET_INCOME'],
                id: 'NET_INCOME',
              },
              {
                cells: [
                  {
                    key: 'name',
                    value: 'Total Equity',
                  },
                  {
                    key: 'total',
                    value: '-$113,923.00',
                  },
                ],
                row_types: ['TOTAL'],
                id: 'EQUITY',
              },
            ],
          },
          {
            cells: [
              {
                key: 'name',
                value: 'Total Liabilities and Equity',
              },
              {
                key: 'total',
                value: '-$122,623.00',
              },
            ],
            row_types: ['TOTAL'],
            id: 'LIABILITY_EQUITY',
          },
        ],
      },
    ],
  },
  query: {
    display_columns_type: 'total',
    display_columns_by: 'year',
    from_date: '2025-01-01',
    to_date: '2025-06-21',
    number_format: {
      precision: 2,
      divide_on1000: false,
      show_zero: false,
      format_money: 'total',
      negative_format: 'mines',
    },
    none_zero: false,
    none_transactions: false,
    basis: 'cash',
    account_ids: [],
    percentage_of_column: false,
    percentage_of_row: false,
    previous_period: false,
    previous_period_amount_change: false,
    previous_period_percentage_change: false,
    previous_year: false,
    previous_year_amount_change: false,
    previous_year_percentage_change: false,
  },
  meta: {
    organization_name: 'BIGCAPITAL, INC',
    base_currency: 'USD',
    date_format: 'DD MMM yyyy',
    is_cost_compute_running: false,
    sheet_name: 'Balance Sheet Statement',
    formatted_as_date: '2025/06/21',
    formatted_date_range: 'As 2025/06/21',
  },
};
