import { ACCOUNT_TYPE } from '@/constants/accounts';
import {
  ICashFlowSchemaSection,
  CASH_FLOW_SECTION_ID,
  ICashFlowStatementSectionType,
} from './Cashflow.types';

export const CASH_FLOW_SCHEMA = [
  {
    id: CASH_FLOW_SECTION_ID.OPERATING,
    label: 'cash_flow_statement.operating_activities',
    sectionType: ICashFlowStatementSectionType.AGGREGATE,
    children: [
      {
        id: CASH_FLOW_SECTION_ID.NET_INCOME,
        label: 'cash_flow_statement.net_income',
        sectionType: ICashFlowStatementSectionType.NET_INCOME,
      },
      {
        id: CASH_FLOW_SECTION_ID.OPERATING_ACCOUNTS,
        label: 'cash_flow_statement.operating_accounts',
        sectionType: ICashFlowStatementSectionType.ACCOUNTS,
        accountsRelations: [
          { type: ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE, direction: 'mines' },
          { type: ACCOUNT_TYPE.INVENTORY, direction: 'mines' },
          { type: ACCOUNT_TYPE.NON_CURRENT_ASSET, direction: 'mines' },
          { type: ACCOUNT_TYPE.ACCOUNTS_PAYABLE, direction: 'plus' },
          { type: ACCOUNT_TYPE.CREDIT_CARD, direction: 'plus' },
          { type: ACCOUNT_TYPE.TAX_PAYABLE, direction: 'plus' },
          { type: ACCOUNT_TYPE.OTHER_CURRENT_ASSET, direction: 'mines' },
          { type: ACCOUNT_TYPE.OTHER_CURRENT_LIABILITY, direction: 'plus' },
          { type: ACCOUNT_TYPE.NON_CURRENT_LIABILITY, direction: 'plus' },
        ],
        showAlways: true,
      },
    ],
    footerLabel: 'cash_flow_statement.net_cash_operating',
  },
  {
    id: CASH_FLOW_SECTION_ID.INVESTMENT,
    sectionType: ICashFlowStatementSectionType.ACCOUNTS,
    label: 'cash_flow_statement.investment_activities',
    accountsRelations: [{ type: ACCOUNT_TYPE.FIXED_ASSET, direction: 'mines' }],
    footerLabel: 'cash_flow_statement.net_cash_investing',
  },
  {
    id: CASH_FLOW_SECTION_ID.FINANCIAL,
    label: 'cash_flow_statement.financial_activities',
    sectionType: ICashFlowStatementSectionType.ACCOUNTS,
    accountsRelations: [
      { type: ACCOUNT_TYPE.LOGN_TERM_LIABILITY, direction: 'plus' },
      { type: ACCOUNT_TYPE.EQUITY, direction: 'plus' },
    ],
    footerLabel: 'cash_flow_statement.net_cash_financing',
  },
  {
    id: CASH_FLOW_SECTION_ID.CASH_BEGINNING_PERIOD,
    sectionType: ICashFlowStatementSectionType.CASH_AT_BEGINNING,
    label: 'cash_flow_statement.cash_beginning_period',
    accountsRelations: [
      { type: ACCOUNT_TYPE.CASH, direction: 'plus' },
      { type: ACCOUNT_TYPE.BANK, direction: 'plus' },
    ],
  },
  {
    id: CASH_FLOW_SECTION_ID.NET_CASH_INCREASE,
    sectionType: ICashFlowStatementSectionType.TOTAL,
    equation: 'OPERATING + INVESTMENT + FINANCIAL',
    label: 'cash_flow_statement.net_cash_increase',
  },
  {
    id: CASH_FLOW_SECTION_ID.CASH_END_PERIOD,
    label: 'cash_flow_statement.cash_end_period',
    sectionType: ICashFlowStatementSectionType.TOTAL,
    equation: 'NET_CASH_INCREASE + CASH_BEGINNING_PERIOD',
  },
] as ICashFlowSchemaSection[];
