import { IBalanceSheetStructureSection } from 'interfaces';

const balanceSheetStructure: IBalanceSheetStructureSection[] = [
  {
    name: 'Assets',
    sectionType: 'assets',
    type: 'section',
    children: [
      {
        name: 'Current Asset',
        sectionType: 'assets',
        type: 'section',
        children: [
          {
            name: 'Cash and cash equivalents',
            type: 'accounts_section',
            accountsTypes: ['cash', 'bank'],
          },
          {
            name: 'Accounts Receivable',
            type: 'accounts_section',
            accountsTypes: ['accounts_receivable'],
          },
          {
            name: 'Inventories',
            type: 'accounts_section',
            accountsTypes: ['inventory'],
          },
          {
            name: 'Other current assets',
            type: 'accounts_section',
            accountsTypes: ['other_current_asset'],
          },
        ],
        alwaysShow: true,
      },
      {
        name: 'Fixed Asset',
        type: 'accounts_section',
        accountsTypes: ['fixed_asset'],
      },
      {
        name: 'Non-Current Assets',
        type: 'accounts_section',
        accountsTypes: ['non_current_asset'],
      }
    ],
    alwaysShow: true,
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
            name: 'Current Liabilties',
            type: 'accounts_section',
            accountsTypes: [
              'accounts_payable',
              'tax_payable',
              'credit_card',
              'other_current_liability'
            ],
          },
          {
            name: 'Long-Term Liabilities',
            type: 'accounts_section',
            accountsTypes: ['long_term_liability'],
          },
          {
            name: 'Non-Current Liabilities',
            type: 'accounts_section',
            accountsTypes: ['non_current_liability'],
          }
        ],
      },
      {
        name: 'Equity',
        sectionType: 'equity',
        type: 'accounts_section',
        accountsTypes: ['equity'],
      },
    ],
    alwaysShow: true,
  },
];

export default balanceSheetStructure;