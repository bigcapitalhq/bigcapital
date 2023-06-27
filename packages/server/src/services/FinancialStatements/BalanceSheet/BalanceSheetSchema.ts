/* eslint-disable import/prefer-default-export */
import * as R from 'ramda';
import {
  BALANCE_SHEET_SCHEMA_NODE_ID,
  BALANCE_SHEET_SCHEMA_NODE_TYPE,
} from '@/interfaces';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';
import { FinancialSchema } from '../FinancialSchema';


export const BalanceSheetSchema = (Base) =>
  class extends R.compose(FinancialSchema)(Base) {
    /**
     * Retrieves the balance sheet schema.
     * @returns 
     */
    getSchema = () => {
      return getBalanceSheetSchema();
    };
  };

/**
 * Retrieve the balance sheet report schema.
 */
export const getBalanceSheetSchema = () => [
  {
    name: 'balance_sheet.assets',
    id: BALANCE_SHEET_SCHEMA_NODE_ID.ASSETS,
    type: BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE,
    children: [
      {
        name: 'balance_sheet.current_asset',
        id: BALANCE_SHEET_SCHEMA_NODE_ID.CURRENT_ASSETS,
        type: BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE,
        children: [
          {
            name: 'balance_sheet.cash_and_cash_equivalents',
            id: BALANCE_SHEET_SCHEMA_NODE_ID.CASH_EQUIVALENTS,
            type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
            accountsTypes: [ACCOUNT_TYPE.CASH, ACCOUNT_TYPE.BANK],
          },
          {
            name: 'balance_sheet.accounts_receivable',
            id: BALANCE_SHEET_SCHEMA_NODE_ID.ACCOUNTS_RECEIVABLE,
            type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
            accountsTypes: [ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE],
          },
          {
            name: 'balance_sheet.inventory',
            id: BALANCE_SHEET_SCHEMA_NODE_ID.INVENTORY,
            type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
            accountsTypes: [ACCOUNT_TYPE.INVENTORY],
          },
          {
            name: 'balance_sheet.other_current_assets',
            id: BALANCE_SHEET_SCHEMA_NODE_ID.OTHER_CURRENT_ASSET,
            type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
            accountsTypes: [ACCOUNT_TYPE.OTHER_CURRENT_ASSET],
          },
        ],
        alwaysShow: true,
      },
      {
        name: 'balance_sheet.fixed_asset',
        id: BALANCE_SHEET_SCHEMA_NODE_ID.FIXED_ASSET,
        type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
        accountsTypes: [ACCOUNT_TYPE.FIXED_ASSET],
      },
      {
        name: 'balance_sheet.non_current_assets',
        id: BALANCE_SHEET_SCHEMA_NODE_ID.NON_CURRENT_ASSET,
        type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
        accountsTypes: [ACCOUNT_TYPE.NON_CURRENT_ASSET],
      },
    ],
    alwaysShow: true,
  },
  {
    name: 'balance_sheet.liabilities_and_equity',
    id: BALANCE_SHEET_SCHEMA_NODE_ID.LIABILITY_EQUITY,
    type: BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE,
    children: [
      {
        name: 'balance_sheet.liabilities',
        id: BALANCE_SHEET_SCHEMA_NODE_ID.LIABILITY,
        type: BALANCE_SHEET_SCHEMA_NODE_TYPE.AGGREGATE,
        children: [
          {
            name: 'balance_sheet.current_liabilities',
            id: BALANCE_SHEET_SCHEMA_NODE_ID.CURRENT_LIABILITY,
            type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
            accountsTypes: [
              ACCOUNT_TYPE.ACCOUNTS_PAYABLE,
              ACCOUNT_TYPE.TAX_PAYABLE,
              ACCOUNT_TYPE.CREDIT_CARD,
              ACCOUNT_TYPE.OTHER_CURRENT_LIABILITY,
            ],
          },
          {
            name: 'balance_sheet.long_term_liabilities',
            id: BALANCE_SHEET_SCHEMA_NODE_ID.LOGN_TERM_LIABILITY,
            type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
            accountsTypes: [ACCOUNT_TYPE.LOGN_TERM_LIABILITY],
          },
          {
            name: 'balance_sheet.non_current_liabilities',
            id: BALANCE_SHEET_SCHEMA_NODE_ID.NON_CURRENT_LIABILITY,
            type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
            accountsTypes: [ACCOUNT_TYPE.NON_CURRENT_LIABILITY],
          },
        ],
      },
      {
        name: 'balance_sheet.equity',
        id: BALANCE_SHEET_SCHEMA_NODE_ID.EQUITY,
        type: BALANCE_SHEET_SCHEMA_NODE_TYPE.ACCOUNTS,
        accountsTypes: [ACCOUNT_TYPE.EQUITY],
      },
    ],
    alwaysShow: true,
  },
];
