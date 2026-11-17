import * as moment from 'moment';
import { z } from 'zod';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { ACCOUNT_TYPE } from '@/constants/accounts';
import { BALANCE_SHEET_SCHEMA_NODE_ID } from '@/modules/FinancialStatements/modules/BalanceSheet/BalanceSheet.types';

const DATE_FORMAT = 'YYYY-MM-DD';

export const BALANCE_SHEET_SECTION_IDS = [
  'assets',
  'liabilities',
  'equity',
] as const;

export type BalanceSheetSectionId = (typeof BALANCE_SHEET_SECTION_IDS)[number];

export const BALANCE_SHEET_GROUP_IDS = [
  'cash-and-cash-equivalents',
  'accounts-receivable',
  'inventory',
  'other-current-assets',
  'fixed-assets',
  'non-current-assets',
  'current-liabilities',
  'long-term-liabilities',
  'non-current-liabilities',
  'equity',
  'net-income',
] as const;

export type BalanceSheetGroupId = (typeof BALANCE_SHEET_GROUP_IDS)[number];

export const BALANCE_SHEET_GROUP_FILTER_IDS = [
  ...BALANCE_SHEET_GROUP_IDS,
  'current-assets',
] as const;

export type BalanceSheetGroupFilterId =
  (typeof BALANCE_SHEET_GROUP_FILTER_IDS)[number];

export interface IBalanceSheetGroupConfig {
  id: BalanceSheetGroupId;
  name: string;
  description: string;
  sectionId: BalanceSheetSectionId;
  accountTypes: string[];
  schemaNodeId: string;
  isNetIncome?: boolean;
}

/**
 * Balance sheet groups exposed by the AI tool.
 *
 * The groups mirror the canonical balance sheet schema so the tool answers
 * with the same categories users see in the report. The schema node ids are
 * kept next to each group to catch drift with the report schema in tests.
 */
export const BALANCE_SHEET_GROUPS: readonly IBalanceSheetGroupConfig[] = [
  {
    id: 'cash-and-cash-equivalents',
    name: 'Cash & Cash Equivalents',
    description: 'Cash on hand and balances in bank accounts.',
    sectionId: 'assets',
    accountTypes: [ACCOUNT_TYPE.CASH, ACCOUNT_TYPE.BANK],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.CASH_EQUIVALENTS,
  },
  {
    id: 'accounts-receivable',
    name: 'Accounts Receivable',
    description: 'Amounts customers owe the organization.',
    sectionId: 'assets',
    accountTypes: [ACCOUNT_TYPE.ACCOUNTS_RECEIVABLE],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.ACCOUNTS_RECEIVABLE,
  },
  {
    id: 'inventory',
    name: 'Inventory',
    description: 'Value of inventory on hand.',
    sectionId: 'assets',
    accountTypes: [ACCOUNT_TYPE.INVENTORY],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.INVENTORY,
  },
  {
    id: 'other-current-assets',
    name: 'Other Current Assets',
    description:
      'Short-term assets that are not cash, receivables, or inventory.',
    sectionId: 'assets',
    accountTypes: [ACCOUNT_TYPE.OTHER_CURRENT_ASSET],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.OTHER_CURRENT_ASSET,
  },
  {
    id: 'fixed-assets',
    name: 'Fixed Assets',
    description:
      'Long-lived tangible assets such as equipment, vehicles, and furniture.',
    sectionId: 'assets',
    accountTypes: [ACCOUNT_TYPE.FIXED_ASSET],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.FIXED_ASSET,
  },
  {
    id: 'non-current-assets',
    name: 'Non-Current Assets',
    description: 'Long-term assets that are not classified as fixed assets.',
    sectionId: 'assets',
    accountTypes: [ACCOUNT_TYPE.NON_CURRENT_ASSET],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.NON_CURRENT_ASSET,
  },
  {
    id: 'current-liabilities',
    name: 'Current Liabilities',
    description:
      'Amounts due within one year, including payables, tax payable, and credit cards.',
    sectionId: 'liabilities',
    accountTypes: [
      ACCOUNT_TYPE.ACCOUNTS_PAYABLE,
      ACCOUNT_TYPE.TAX_PAYABLE,
      ACCOUNT_TYPE.CREDIT_CARD,
      ACCOUNT_TYPE.OTHER_CURRENT_LIABILITY,
    ],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.CURRENT_LIABILITY,
  },
  {
    id: 'long-term-liabilities',
    name: 'Long-Term Liabilities',
    description: 'Amounts due after one year.',
    sectionId: 'liabilities',
    accountTypes: [ACCOUNT_TYPE.LOGN_TERM_LIABILITY],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.LOGN_TERM_LIABILITY,
  },
  {
    id: 'non-current-liabilities',
    name: 'Non-Current Liabilities',
    description: 'Other long-term obligations.',
    sectionId: 'liabilities',
    accountTypes: [ACCOUNT_TYPE.NON_CURRENT_LIABILITY],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.NON_CURRENT_LIABILITY,
  },
  {
    id: 'equity',
    name: 'Equity',
    description:
      "Owners' residual interest in the assets after deducting liabilities.",
    sectionId: 'equity',
    accountTypes: [ACCOUNT_TYPE.EQUITY],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.EQUITY,
  },
  {
    id: 'net-income',
    name: 'Net Income',
    description: 'Cumulative income minus expenses not yet closed to equity.',
    sectionId: 'equity',
    accountTypes: [
      ACCOUNT_TYPE.INCOME,
      ACCOUNT_TYPE.OTHER_INCOME,
      ACCOUNT_TYPE.COST_OF_GOODS_SOLD,
      ACCOUNT_TYPE.EXPENSE,
      ACCOUNT_TYPE.OTHER_EXPENSE,
    ],
    schemaNodeId: BALANCE_SHEET_SCHEMA_NODE_ID.NET_INCOME,
    isNetIncome: true,
  },
];

export const BALANCE_SHEET_GROUP_BY_ID = new Map<
  BalanceSheetGroupId,
  IBalanceSheetGroupConfig
>(BALANCE_SHEET_GROUPS.map((group) => [group.id, group]));

export const BALANCE_SHEET_GROUP_BY_ACCOUNT_TYPE = new Map<
  string,
  IBalanceSheetGroupConfig
>(
  BALANCE_SHEET_GROUPS.flatMap((group) =>
    group.accountTypes.map((accountType) => [accountType, group] as const),
  ),
);

export const BALANCE_SHEET_CURRENT_ASSET_GROUP_IDS: BalanceSheetGroupId[] = [
  'cash-and-cash-equivalents',
  'accounts-receivable',
  'inventory',
  'other-current-assets',
];

export const BALANCE_SHEET_GROUPS_BY_SECTION: Record<
  BalanceSheetSectionId,
  BalanceSheetGroupId[]
> = {
  assets: BALANCE_SHEET_GROUPS.filter(
    (group) => group.sectionId === 'assets',
  ).map((group) => group.id),
  liabilities: BALANCE_SHEET_GROUPS.filter(
    (group) => group.sectionId === 'liabilities',
  ).map((group) => group.id),
  equity: BALANCE_SHEET_GROUPS.filter(
    (group) => group.sectionId === 'equity',
  ).map((group) => group.id),
};

export const BALANCE_SHEET_SECTION_NAMES: Record<
  BalanceSheetSectionId,
  string
> = {
  assets: 'Assets',
  liabilities: 'Liabilities',
  equity: 'Equity',
};

export const BALANCE_SHEET_COMPARISON_MODES = [
  'compare-to-date',
  'previous-year',
  'previous-month',
  'previous-quarter',
  'previous-period',
] as const;

export type BalanceSheetComparisonMode =
  (typeof BALANCE_SHEET_COMPARISON_MODES)[number];

export const DEFAULT_MAX_ACCOUNTS_PER_GROUP = 8;
export const MAX_ACCOUNTS_PER_GROUP = 50;

const emptyStringToUndefined = (value: unknown): unknown =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

const emptyArrayToUndefined = (value: unknown): unknown =>
  Array.isArray(value) && value.length === 0 ? undefined : value;

const dateField = (description: string) =>
  z
    .preprocess(
      emptyStringToUndefined,
      z
        .string()
        .refine((value) => moment(value, DATE_FORMAT, true).isValid(), {
          message: `Date must be a valid date in ${DATE_FORMAT} format.`,
        })
        .optional(),
    )
    .describe(description);

const optionalStringField = (description: string) =>
  z
    .preprocess(
      emptyStringToUndefined,
      z.string().trim().min(1).max(120).optional(),
    )
    .describe(description);

const optionalBooleanField = (description: string) =>
  z
    .preprocess((value) => {
      if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true') {
          return true;
        }
        if (normalized === 'false') {
          return false;
        }
        if (normalized === '') {
          return undefined;
        }
      }
      return value;
    }, z.boolean().optional())
    .describe(description);

const moneyField = (description: string) =>
  z
    .number()
    .describe(
      `${description} The amount is in the organization base currency.`,
    );

const percentageField = (description: string) =>
  z
    .number()
    .describe(`${description} The percentage is rounded to 2 decimals.`);

/**
 * Input schema for the balance sheet AI tool.
 *
 * Every knob the model can pull is described here. Defaults are resolved by
 * the repository/builder rather than evaluated at module load so "today" and
 * the organization basis stay accurate for every request.
 */
export const balanceSheetInputSchema = z
  .object({
    asOfDate: dateField(
      'As-of date in YYYY-MM-DD format. Balances are calculated through the end of this date. Defaults to today.',
    ),
    compareToDate: dateField(
      'Optional explicit comparison date in YYYY-MM-DD format. Use for a specific prior period end. Must be on or before asOfDate. Takes precedence over compare when both are provided.',
    ),
    compare: z
      .preprocess(
        emptyStringToUndefined,
        z
          .enum([
            'previous-year',
            'previous-month',
            'previous-quarter',
            'previous-period',
          ])
          .optional(),
      )
      .describe(
        'Convenience comparison mode. previous-year uses the same date one year earlier; previous-month uses the prior month end; previous-quarter uses the prior quarter end; previous-period uses the equal-length period immediately before periodStartDate..asOfDate. Ignored when compareToDate is provided.',
      ),
    periodStartDate: dateField(
      'Start of the reporting period used to resolve compare=previous-period. Defaults to the start of the organization fiscal year.',
    ),
    basis: z
      .preprocess(
        emptyStringToUndefined,
        z.nativeEnum(AccountingBasis).optional(),
      )
      .describe(
        'Accounting basis. Defaults to the organization accounting basis.',
      ),
    sections: z
      .preprocess(
        emptyArrayToUndefined,
        z
          .array(z.enum(BALANCE_SHEET_SECTION_IDS))
          .min(1)
          .max(BALANCE_SHEET_SECTION_IDS.length)
          .optional(),
      )
      .describe(
        'Limit which sections are displayed. Omit for all sections. Totals are always calculated from the full balance sheet.',
      ),
    groupIds: z
      .preprocess(
        emptyArrayToUndefined,
        z
          .array(z.enum(BALANCE_SHEET_GROUP_FILTER_IDS))
          .min(1)
          .max(BALANCE_SHEET_GROUP_FILTER_IDS.length)
          .optional(),
      )
      .describe(
        'Limit which balance-sheet groups are displayed. current-assets expands to cash, receivables, inventory, and other current assets. Omit for all groups. Totals are always calculated from the full balance sheet.',
      ),
    accountIds: z
      .preprocess(
        emptyArrayToUndefined,
        z.array(z.number().int().positive()).min(1).max(50).optional(),
      )
      .describe(
        'Focus on specific balance-sheet account IDs and their descendants. Takes precedence over accountQuery when both are provided.',
      ),
    accountQuery: optionalStringField(
      'Account name or code (full or partial) to focus on. Only use this when the user explicitly names a specific account. Do not use it for the whole balance sheet, a section, or a group; generic full-report phrases are ignored. If multiple accounts match, the tool returns matches so you can ask the user which one to use. Ignored when accountIds is provided.',
    ),
    includeAccounts: optionalBooleanField(
      'Whether to include account rows. Defaults to true. Group totals always include all accounts even when account rows are limited.',
    ),
    includeZeroBalances: optionalBooleanField(
      'Include accounts with a zero balance. Defaults to false.',
    ),
    maxAccountsPerGroup: z
      .preprocess(
        (value) =>
          value === 0 || value === null || value === '' ? undefined : value,
        z.number().int().min(1).max(MAX_ACCOUNTS_PER_GROUP).optional(),
      )
      .describe(
        `Maximum account rows per group, sorted by absolute balance. Defaults to ${DEFAULT_MAX_ACCOUNTS_PER_GROUP}, maximum ${MAX_ACCOUNTS_PER_GROUP}. Group totals are unaffected.`,
      ),
  })
  .superRefine((value, context) => {
    const asOfDate = value.asOfDate ?? moment().format(DATE_FORMAT);

    if (
      value.compareToDate &&
      moment(value.compareToDate, DATE_FORMAT, true).isAfter(
        moment(asOfDate, DATE_FORMAT, true),
        'day',
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['compareToDate'],
        message: 'compareToDate must be on or before asOfDate.',
      });
    }

    if (
      value.periodStartDate &&
      moment(value.periodStartDate, DATE_FORMAT, true).isAfter(
        moment(asOfDate, DATE_FORMAT, true),
        'day',
      )
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['periodStartDate'],
        message: 'periodStartDate must be on or before asOfDate.',
      });
    }
  });

export type BalanceSheetToolInput = z.infer<typeof balanceSheetInputSchema>;

export const balanceSheetComparisonSchema = z.object({
  asOfDate: z.string().describe('The comparison date in YYYY-MM-DD format.'),
  previousBalance: moneyField('The balance at the comparison date.'),
  change: moneyField(
    'The change from the comparison date to the current as-of date.',
  ),
  changePercentage: z
    .number()
    .nullable()
    .describe(
      'Percentage change from the comparison balance. Null when the comparison balance is zero.',
    ),
});

export const balanceSheetTotalsComparisonSchema = z.object({
  asOfDate: z.string().describe('The comparison date in YYYY-MM-DD format.'),
  assets: moneyField('Total assets at the comparison date.'),
  liabilities: moneyField('Total liabilities at the comparison date.'),
  equity: moneyField('Total equity at the comparison date.'),
  liabilitiesAndEquity: moneyField(
    'Total liabilities plus equity at the comparison date.',
  ),
  difference: moneyField(
    'Assets minus liabilities and equity at the comparison date.',
  ),
  isBalanced: z
    .boolean()
    .describe(
      'Whether assets equal liabilities plus equity at the comparison date within 0.01.',
    ),
  changes: z.object({
    assets: moneyField('Change in total assets.'),
    liabilities: moneyField('Change in total liabilities.'),
    equity: moneyField('Change in total equity.'),
    liabilitiesAndEquity: moneyField('Change in total liabilities and equity.'),
  }),
  percentageChanges: z.object({
    assets: z
      .number()
      .nullable()
      .describe(
        'Percentage change in total assets; null when the prior value is zero.',
      ),
    liabilities: z
      .number()
      .nullable()
      .describe(
        'Percentage change in total liabilities; null when the prior value is zero.',
      ),
    equity: z
      .number()
      .nullable()
      .describe(
        'Percentage change in total equity; null when the prior value is zero.',
      ),
    liabilitiesAndEquity: z
      .number()
      .nullable()
      .describe(
        'Percentage change in total liabilities and equity; null when the prior value is zero.',
      ),
  }),
});

export const balanceSheetAccountRowSchema = z.object({
  id: z.number().int().describe('Account ID.'),
  code: z.string().nullable().describe('Account code, when set.'),
  name: z.string().describe('Account name.'),
  accountType: z
    .string()
    .describe(
      'Bigcapital account type key, such as cash or accounts-receivable.',
    ),
  parentId: z
    .number()
    .int()
    .nullable()
    .describe('Parent account ID; null for top-level accounts.'),
  depth: z
    .number()
    .int()
    .min(0)
    .describe('Zero-based depth in the account hierarchy.'),
  hasChildren: z
    .boolean()
    .describe('Whether this account has descendant accounts.'),
  ownBalance: moneyField(
    'Closing balance posted directly to this account, excluding descendants.',
  ),
  balance: moneyField(
    'Closing balance of this account including all descendant accounts.',
  ),
  percentageOfGroup: percentageField(
    'This account balance as a percentage of the group total.',
  ),
  comparison: balanceSheetComparisonSchema.optional(),
});

export const balanceSheetNetIncomeBreakdownSchema = z.object({
  income: moneyField('Cumulative income through the as-of date.'),
  expenses: moneyField('Cumulative expenses through the as-of date.'),
  netIncome: moneyField('Income minus expenses through the as-of date.'),
});

export const balanceSheetGroupSchema = z.object({
  id: z.enum(BALANCE_SHEET_GROUP_IDS).describe('Stable group identifier.'),
  name: z.string().describe('Human-readable group name.'),
  description: z
    .string()
    .describe('Short explanation of what the group contains.'),
  sectionId: z
    .enum(BALANCE_SHEET_SECTION_IDS)
    .describe('Section this group belongs to.'),
  total: moneyField(
    'Group closing balance. Includes all accounts in the group even when account rows are limited or filtered.',
  ),
  percentageOfSection: percentageField(
    'Group total as a percentage of the full section total.',
  ),
  accountCount: z
    .number()
    .int()
    .min(0)
    .describe('Number of accounts that match the filters before row limiting.'),
  accountsReturned: z
    .number()
    .int()
    .min(0)
    .describe('Number of account rows included in this response.'),
  accountsTruncated: z
    .boolean()
    .describe('True when accountCount is greater than accountsReturned.'),
  accounts: z.array(balanceSheetAccountRowSchema),
  netIncomeBreakdown: balanceSheetNetIncomeBreakdownSchema
    .optional()
    .describe(
      'Income and expense components; only present for the net-income group.',
    ),
  comparison: balanceSheetComparisonSchema.optional(),
});

export const balanceSheetSectionSchema = z.object({
  id: z.enum(BALANCE_SHEET_SECTION_IDS).describe('Section identifier.'),
  name: z.string().describe('Human-readable section name.'),
  total: moneyField(
    'Section closing balance. Includes all groups in the section even when some groups are filtered out of the response.',
  ),
  comparison: balanceSheetComparisonSchema.optional(),
  groups: z.array(balanceSheetGroupSchema),
});

export const balanceSheetTotalsSchema = z.object({
  assets: moneyField('Total assets across the full balance sheet.'),
  liabilities: moneyField('Total liabilities across the full balance sheet.'),
  equity: moneyField(
    'Total equity, including cumulative net income, across the full balance sheet.',
  ),
  liabilitiesAndEquity: moneyField('Total liabilities plus total equity.'),
  difference: moneyField(
    'Total assets minus total liabilities and equity. A non-zero value means the balance sheet does not balance.',
  ),
  isBalanced: z
    .boolean()
    .describe('True when assets equal liabilities plus equity within 0.01.'),
  comparison: balanceSheetTotalsComparisonSchema.optional(),
});

export const balanceSheetAccountMatchSchema = z.object({
  id: z.number().int().describe('Account ID.'),
  code: z.string().nullable().describe('Account code, when set.'),
  name: z.string().describe('Account name.'),
  accountType: z.string().describe('Bigcapital account type key.'),
  isBalanceSheetAccount: z
    .boolean()
    .describe(
      'Whether the account appears directly on the balance sheet. False for profit-and-loss accounts.',
    ),
});

export const balanceSheetSuccessSchema = z.object({
  found: z.literal(true),
  asOfDate: z.string().describe('The as-of date in YYYY-MM-DD format.'),
  basis: z
    .nativeEnum(AccountingBasis)
    .describe('Accounting basis used for the calculations.'),
  currency: z
    .string()
    .describe('Organization base currency code for all amounts.'),
  comparison: z
    .object({
      asOfDate: z
        .string()
        .describe('The comparison date in YYYY-MM-DD format.'),
      mode: z
        .enum(BALANCE_SHEET_COMPARISON_MODES)
        .describe('How the comparison date was selected.'),
    })
    .nullable()
    .describe('Comparison metadata; null when no comparison was requested.'),
  appliedFilters: z.object({
    sections: z
      .array(z.enum(BALANCE_SHEET_SECTION_IDS))
      .nullable()
      .describe(
        'Section filter applied to the response; null when all sections are included.',
      ),
    groupIds: z
      .array(z.enum(BALANCE_SHEET_GROUP_FILTER_IDS))
      .nullable()
      .describe(
        'Group filter applied to the response; null when all groups are included.',
      ),
    accountIds: z
      .array(z.number().int())
      .nullable()
      .describe('Account ID focus supplied by the caller; null when absent.'),
    accountQuery: z
      .string()
      .nullable()
      .describe(
        'Account name/code focus supplied by the caller; null when absent or ignored.',
      ),
    ignoredAccountQuery: z
      .string()
      .nullable()
      .describe(
        'An accountQuery that was ignored because it describes the whole balance sheet rather than a specific account.',
      ),
    resolvedAccountIds: z
      .array(z.number().int())
      .nullable()
      .describe(
        'Account IDs actually used for focus after resolving a name/code query.',
      ),
    includeAccounts: z
      .boolean()
      .describe('Whether account rows were requested.'),
    includeZeroBalances: z
      .boolean()
      .describe('Whether zero-balance accounts were requested.'),
    maxAccountsPerGroup: z
      .number()
      .int()
      .describe('Maximum account rows per group.'),
  }),
  totals: balanceSheetTotalsSchema,
  sections: z.array(balanceSheetSectionSchema),
  notes: z
    .array(z.string())
    .describe('Short deterministic caveats about the response.'),
});

export const balanceSheetUnresolvedSchema = z.object({
  found: z.literal(false),
  reason: z
    .enum(['not_found', 'ambiguous'])
    .describe('Why the account focus could not be resolved.'),
  matches: z.array(balanceSheetAccountMatchSchema),
  message: z
    .string()
    .describe('Instruction for the assistant about how to proceed.'),
});

export const balanceSheetErrorSchema = z.object({
  error: z.string().describe('A user-safe error message.'),
});

export const balanceSheetOutputSchema = z.union([
  balanceSheetSuccessSchema,
  balanceSheetUnresolvedSchema,
  balanceSheetErrorSchema,
]);

export type BalanceSheetSuccessOutput = z.infer<
  typeof balanceSheetSuccessSchema
> & { found: true };
export type BalanceSheetUnresolvedOutput = z.infer<
  typeof balanceSheetUnresolvedSchema
> & { found: false };
export type BalanceSheetToolOutput = z.infer<typeof balanceSheetOutputSchema>;
