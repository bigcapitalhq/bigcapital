import { ICashFlowSchemaSection, CASH_FLOW_SECTION_ID, ICashFlowStatementSectionType } from '@/interfaces';
import { ACCOUNT_TYPE } from '@/data/AccountTypes';

export default [
  {
    id: CASH_FLOW_SECTION_ID.OPERATING,
    label: 'OPERATING ACTIVITIES',
    sectionType: ICashFlowStatementSectionType.AGGREGATE,
    children: [
      {
        id: CASH_FLOW_SECTION_ID.NET_INCOME,
        label: 'Net income',
        sectionType: ICashFlowStatementSectionType.NET_INCOME,
      },
      {
        id: CASH_FLOW_SECTION_ID.OPERATING_ACCOUNTS,
        label: 'Adjustments net income by operating activities.',
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
    footerLabel: 'Net cash provided by operating activities',
  },
  {
    id: CASH_FLOW_SECTION_ID.INVESTMENT,
    sectionType: ICashFlowStatementSectionType.ACCOUNTS,
    label: 'INVESTMENT ACTIVITIES',
    accountsRelations: [
      { type: ACCOUNT_TYPE.FIXED_ASSET, direction: 'mines' }
    ],
    footerLabel: 'Net cash provided by investing activities',
  },
  {
    id: CASH_FLOW_SECTION_ID.FINANCIAL,
    label: 'FINANCIAL ACTIVITIES',
    sectionType: ICashFlowStatementSectionType.ACCOUNTS,
    accountsRelations: [
      { type: ACCOUNT_TYPE.LOGN_TERM_LIABILITY, direction: 'plus' },
      { type: ACCOUNT_TYPE.EQUITY, direction: 'plus' },
    ],
    footerLabel: 'Net cash provided by financing activities',
  },
  {
    id: CASH_FLOW_SECTION_ID.CASH_BEGINNING_PERIOD,
    sectionType: ICashFlowStatementSectionType.CASH_AT_BEGINNING,
    label: 'Cash at beginning of period',
    accountsRelations: [
      { type: ACCOUNT_TYPE.CASH, direction: 'plus' },
      { type: ACCOUNT_TYPE.BANK, direction: 'plus' },
    ],
  },
  {
    id: CASH_FLOW_SECTION_ID.NET_CASH_INCREASE,
    sectionType: ICashFlowStatementSectionType.TOTAL,
    equation: 'OPERATING + INVESTMENT + FINANCIAL',
    label: 'NET CASH INCREASE FOR PERIOD',
  },
  {
    id: CASH_FLOW_SECTION_ID.CASH_END_PERIOD,
    label: 'CASH AT END OF PERIOD',
    sectionType: ICashFlowStatementSectionType.TOTAL,
    equation: 'NET_CASH_INCREASE + CASH_BEGINNING_PERIOD',
  },
] as ICashFlowSchemaSection[];
