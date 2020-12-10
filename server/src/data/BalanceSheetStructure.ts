import { IBalanceSheetStructureSection } from 'interfaces';

const balanceSheetStructure: IBalanceSheetStructureSection[] = [
  {
    name: 'Assets',
    sectionType: 'assets',
    type: 'section',
    children: [
      {
        name: 'Current Asset',
        type: 'accounts_section',
        _accountsTypesRelated: ['current_asset'],
      },
      {
        name: 'Fixed Asset',
        type: 'accounts_section',
        _accountsTypesRelated: ['fixed_asset'],
      },
      {
        name: 'Other Asset',
        type: 'accounts_section',
        _accountsTypesRelated: ['other_asset'],
      },
    ],
    _forceShow: true,
  },
  {
    name: 'Liabilities and Equity',
    sectionType: 'liabilities_equity',
    type: 'section',
    children: [
      {
        name: 'Liabilities',
        sectionType: 'liability',
        type: 'section',
        children: [
          {
            name: 'Current Liability',
            type: 'accounts_section',
            _accountsTypesRelated: ['current_liability'],
          },
          {
            name: 'Long Term Liability',
            type: 'accounts_section',
            _accountsTypesRelated: ['long_term_liability'],
          },
          {
            name: 'Other Liability',
            type: 'accounts_section',
            _accountsTypesRelated: ['other_liability'],
          },
        ],
      },
      {
        name: 'Equity',
        sectionType: 'equity',
        type: 'accounts_section',
        _accountsTypesRelated: ['equity'],
      },
    ],
    _forceShow: true,
  },
];

export default balanceSheetStructure;