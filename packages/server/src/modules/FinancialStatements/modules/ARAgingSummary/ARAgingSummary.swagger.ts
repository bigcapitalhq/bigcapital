export const ARAgingSummaryResponseExample = {
  query: {
    as_date: '2025-06-30',
    aging_days_before: 30,
    aging_periods: 3,
    number_format: {
      divide_on1000: false,
      negative_format: 'mines',
      show_zero: false,
      format_money: 'total',
      precision: 2,
    },
    customers_ids: [],
    branches_ids: [],
    none_zero: false,
  },
  columns: [
    {
      from_period: '2025-06-30',
      to_period: '2025-05-31',
      before_days: 0,
      to_days: 30,
    },
    {
      from_period: '2025-05-31',
      to_period: '2025-05-01',
      before_days: 31,
      to_days: 60,
    },
    {
      from_period: '2025-05-01',
      to_period: null,
      before_days: 61,
      to_days: null,
    },
  ],
  data: {
    customers: [
      {
        customer_name: 'business',
        current: {
          amount: 0,
          formatted_amount: '',
        },
        aging: [
          {
            from_period: '2025-06-30',
            to_period: '2025-05-31',
            before_days: 0,
            to_days: 30,
            total: {
              amount: 5000,
              formatted_amount: '5,000.00',
            },
          },
          {
            from_period: '2025-05-31',
            to_period: '2025-05-01',
            before_days: 31,
            to_days: 60,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
          {
            from_period: '2025-05-01',
            to_period: null,
            before_days: 61,
            to_days: null,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
        ],
        total: {
          amount: 5000,
          formatted_amount: '$5,000.00',
        },
      },
      {
        customer_name: 'business',
        current: {
          amount: 0,
          formatted_amount: '',
        },
        aging: [
          {
            from_period: '2025-06-30',
            to_period: '2025-05-31',
            before_days: 0,
            to_days: 30,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
          {
            from_period: '2025-05-31',
            to_period: '2025-05-01',
            before_days: 31,
            to_days: 60,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
          {
            from_period: '2025-05-01',
            to_period: null,
            before_days: 61,
            to_days: null,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
        ],
        total: {
          amount: 0,
          formatted_amount: '$0.00',
        },
      },
      {
        customer_name: 'asdsadasd, asd',
        current: {
          amount: 0,
          formatted_amount: '',
        },
        aging: [
          {
            from_period: '2025-06-30',
            to_period: '2025-05-31',
            before_days: 0,
            to_days: 30,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
          {
            from_period: '2025-05-31',
            to_period: '2025-05-01',
            before_days: 31,
            to_days: 60,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
          {
            from_period: '2025-05-01',
            to_period: null,
            before_days: 61,
            to_days: null,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
        ],
        total: {
          amount: 0,
          formatted_amount: '$0.00',
        },
      },
      {
        customer_name: 'Ahmed Bouhuolia',
        current: {
          amount: 300000,
          formatted_amount: '300,000.00',
        },
        aging: [
          {
            from_period: '2025-06-30',
            to_period: '2025-05-31',
            before_days: 0,
            to_days: 30,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
          {
            from_period: '2025-05-31',
            to_period: '2025-05-01',
            before_days: 31,
            to_days: 60,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
          {
            from_period: '2025-05-01',
            to_period: null,
            before_days: 61,
            to_days: null,
            total: {
              amount: 0,
              formatted_amount: '',
            },
          },
        ],
        total: {
          amount: 300000,
          formatted_amount: '$300,000.00',
        },
      },
    ],
    total: {
      current: {
        amount: 300000,
        formatted_amount: '$300,000.00',
      },
      aging: [
        {
          from_period: '2025-06-30',
          to_period: '2025-05-31',
          before_days: 0,
          to_days: 30,
          total: {
            amount: 5000,
            formatted_amount: '$5,000.00',
          },
        },
        {
          from_period: '2025-05-31',
          to_period: '2025-05-01',
          before_days: 31,
          to_days: 60,
          total: {
            amount: 0,
            formatted_amount: '$0.00',
          },
        },
        {
          from_period: '2025-05-01',
          to_period: null,
          before_days: 61,
          to_days: null,
          total: {
            amount: 0,
            formatted_amount: '$0.00',
          },
        },
      ],
      total: {
        amount: 305000,
        formatted_amount: '$305,000.00',
      },
    },
  },
  meta: {
    organization_name: 'BIGCAPITAL, INC',
    base_currency: 'USD',
    date_format: 'DD MMM yyyy',
    is_cost_compute_running: false,
    sheet_name: 'A/R Aging Summary',
    formatted_as_date: '2025/06/30',
    formatted_date_range: 'As 2025/06/30',
  },
};
