
export default [
  {
    name: 'Assets',
    section_type: 'assets',
    type: 'section',
    children: [
      {
        name: 'Current Asset',
        type: 'section',
        _accounts_types_related: ['current_asset'],
      },
      {
        name: 'Fixed Asset',
        type: 'section',
        _accounts_types_related: ['fixed_asset'],
      },
      {
        name: 'Other Asset',
        type: 'section',
        _accounts_types_related: ['other_asset'],
      },
    ],
    _forceShow: true,
  },
  {
    name: 'Liabilities and Equity',
    section_type: 'liabilities_equity',
    type: 'section',
    children: [
      {
        name: 'Liabilities',
        section_type: 'liability',
        type: 'section',
        children: [
          {
            name: 'Current Liability',
            type: 'section',
            _accounts_types_related: ['current_liability'],
          },
          {
            name: 'Long Term Liability',
            type: 'section',
            _accounts_types_related: ['long_term_liability'],
          },
          {
            name: 'Other Liability',
            type: 'section',
            _accounts_types_related: ['other_liability'],
          },
        ],
      },
      {
        name: 'Equity',
        section_type: 'equity',
        type: 'section',
        _accounts_types_related: ['equity'],
      },
    ],
    _forceShow: true,
  },
];
