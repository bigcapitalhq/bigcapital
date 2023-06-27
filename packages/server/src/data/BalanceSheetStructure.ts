import { IBalanceSheetStructureSection } from '@/interfaces';
import {
  ACCOUNT_TYPE
} from '@/data/AccountTypes';

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
            accountsTypes: [ACCOUNT_TYPE.CASH, ACCOUNT_TYPE.BANK],
          },
          {
            name: 'Accounts Receivable',
            type: 'accounts_section',
            accountsTypes: [ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE],
          },
          {
            name: 'Inventories',
            type: 'accounts_section',
            accountsTypes: [ACCOUNT_TYPE.INVENTORY],
          },
          {
            name: 'Other current assets',
            type: 'accounts_section',
            accountsTypes: [ACCOUNT_TYPE.OTHER_CURRENT_ASSET],
          },
        ],
        alwaysShow: true,
      },
      {
        name: 'Fixed Asset',
        type: 'accounts_section',
        accountsTypes: [ACCOUNT_TYPE.FIXED_ASSET],
      },
      {
        name: 'Non-Current Assets',
        type: 'accounts_section',
        accountsTypes: [ACCOUNT_TYPE.NON_CURRENT_ASSET],
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
            name: 'Current Liabilities',
            type: 'accounts_section',
            accountsTypes: [
              ACCOUNT_TYPE.ACCOUNTS_PAYABLE,
              ACCOUNT_TYPE.TAX_PAYABLE,
              ACCOUNT_TYPE.CREDIT_CARD,
              ACCOUNT_TYPE.OTHER_CURRENT_LIABILITY,
            ],
          },
          {
            name: 'Long-Term Liabilities',
            type: 'accounts_section',
            accountsTypes: [ACCOUNT_TYPE.LOGN_TERM_LIABILITY],
          },
          {
            name: 'Non-Current Liabilities',
            type: 'accounts_section',
            accountsTypes: [ACCOUNT_TYPE.NON_CURRENT_LIABILITY],
          }
        ],
      },
      {
        name: 'Equity',
        sectionType: 'equity',
        type: 'accounts_section',
        accountsTypes: [ACCOUNT_TYPE.EQUITY],
      },
    ],
    alwaysShow: true,
  },
];

export default balanceSheetStructure;