

export default {
  organization: [
    {
      key: 'name',
      type: 'string',
      config: true,
    },
    {
      key: 'base_currency',
      type: 'string',
      config: true,
    },
    {
      key: 'industry',
      type: 'string',
    },
    {
      key: 'location',
      type: 'string',
    },
    {
      key: 'fiscal_year',
      type: 'string',
      // config: true,
    },
    {
      key: 'financial_date_start',
      type: 'string',
    },
    {
      key: 'language',
      type: 'string',
      config: true,
    },
    { 
      key: 'time_zone',
      type: 'string',
      // config: true,
    },
    {
      key: 'date_format',
      type: 'string',
      // config: true,
    },
  ],
  manual_journals: [
    {
      key: 'journal_number_next',
      type: 'number',
    },
    {
      key: 'journal_number_prefix',
      type: 'string',
    },
  ]
};