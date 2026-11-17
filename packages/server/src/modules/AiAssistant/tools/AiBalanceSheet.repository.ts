import { Knex } from 'knex';
import * as moment from 'moment';
import { AccountingBasis } from '@/common/types/AccountingBasis';
import { toNumber } from '../utils/number';
import {
  BALANCE_SHEET_GROUP_BY_ACCOUNT_TYPE,
  DEFAULT_MAX_ACCOUNTS_PER_GROUP,
  type BalanceSheetComparisonMode,
  type BalanceSheetGroupFilterId,
  type BalanceSheetSectionId,
  type BalanceSheetSuccessOutput,
  type BalanceSheetToolInput,
  type BalanceSheetUnresolvedOutput,
} from './AiBalanceSheet.schema';
import {
  buildBalanceSheet,
  type IBalanceSheetAccountBalanceRow,
  type IBalanceSheetResolvedFilters,
} from './AiBalanceSheet.builder';

const QUERY_TIMEOUT_MS = 5000;
const DATE_FORMAT = 'YYYY-MM-DD';
const MAX_ACCOUNT_MATCHES = 10;

/**
 * Common phrases models use when they mean the full report rather than a
 * specific account. These are ignored instead of failing the tool call.
 */
const GENERIC_BALANCE_SHEET_QUERY_PATTERN =
  /^(?:(?:the|my|our|a)\s+)?(?:(?:whole|full|entire|complete)\s+)?(?:balance(?:\s+sheet)?|sheet|report|overview|summary|totals?|all|everything|(?:total\s+)?assets?|(?:total\s+)?liabilit(?:y|ies)|(?:total\s+)?equity)$/i;

const FISCAL_YEAR_MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];

export interface IAiBalanceSheetContext {
  baseCurrency: string;
  accountingBasis: AccountingBasis;
  fiscalYear: string | null;
}

export interface IResolvedBalanceSheetComparison {
  asOfDate: string;
  mode: BalanceSheetComparisonMode;
}

interface IAccountMatch {
  id: number;
  code: string | null;
  name: string;
  accountType: string;
  isBalanceSheetAccount: boolean;
}

type AccountFocusResolution =
  | { kind: 'none'; ignoredAccountQuery: string | null }
  | { kind: 'resolved'; accountIds: number[]; ignoredAccountQuery: null }
  | { kind: 'unresolved'; output: BalanceSheetUnresolvedOutput };

/**
 * Returns today's date in the report date format.
 */
export const getTodayDate = (): string => {
  return moment().format(DATE_FORMAT);
};

/**
 * Resolves the start of the organization fiscal year containing the given
 * as-of date. Falls back to January when the fiscal year is unknown.
 */
export const getFiscalYearStart = (
  asOfDate: string,
  fiscalYear: string | null,
): moment.Moment => {
  const monthIndex = fiscalYear
    ? FISCAL_YEAR_MONTHS.indexOf(fiscalYear.trim().toLowerCase())
    : 0;
  const month = monthIndex >= 0 ? monthIndex : 0;
  const asOf = moment(asOfDate, DATE_FORMAT, true).startOf('day');
  const start = asOf.clone().month(month).startOf('month');

  return start.isAfter(asOf, 'day') ? start.subtract(1, 'year') : start;
};

/**
 * Resolves the comparison date requested by the model.
 */
export const resolveBalanceSheetComparison = (
  input: Pick<
    BalanceSheetToolInput,
    'asOfDate' | 'compareToDate' | 'compare' | 'periodStartDate'
  >,
  fiscalYear: string | null,
): IResolvedBalanceSheetComparison | null => {
  const asOfDate = input.asOfDate ?? getTodayDate();
  const asOf = moment(asOfDate, DATE_FORMAT, true).startOf('day');

  if (input.compareToDate) {
    return {
      asOfDate: moment(input.compareToDate, DATE_FORMAT, true).format(
        DATE_FORMAT,
      ),
      mode: 'compare-to-date',
    };
  }

  if (!input.compare) {
    return null;
  }

  if (input.compare === 'previous-year') {
    return {
      asOfDate: asOf.clone().subtract(1, 'year').format(DATE_FORMAT),
      mode: input.compare,
    };
  }

  if (input.compare === 'previous-month') {
    return {
      asOfDate: asOf
        .clone()
        .subtract(1, 'month')
        .endOf('month')
        .format(DATE_FORMAT),
      mode: input.compare,
    };
  }

  if (input.compare === 'previous-quarter') {
    return {
      asOfDate: asOf
        .clone()
        .subtract(1, 'quarter')
        .endOf('quarter')
        .format(DATE_FORMAT),
      mode: input.compare,
    };
  }

  const periodStart = input.periodStartDate
    ? moment(input.periodStartDate, DATE_FORMAT, true).startOf('day')
    : getFiscalYearStart(asOfDate, fiscalYear);
  const periodDays = asOf.diff(periodStart, 'days') + 1;

  return {
    asOfDate: asOf.clone().subtract(periodDays, 'days').format(DATE_FORMAT),
    mode: input.compare,
  };
};

export class AiBalanceSheetRepository {
  constructor(private readonly knex: Knex) {}

  private async query<T = Record<string, any>>(
    sql: string,
    bindings: any[] = [],
  ): Promise<T[]> {
    const [rows] = (await this.knex
      .raw(sql, bindings)
      .timeout(QUERY_TIMEOUT_MS)) as unknown as [T[], any];
    return rows ?? [];
  }

  /**
   * Retrieves the balance sheet as of a date, with optional comparison.
   */
  public async getBalanceSheet(
    input: BalanceSheetToolInput,
    context: IAiBalanceSheetContext,
  ): Promise<BalanceSheetSuccessOutput | BalanceSheetUnresolvedOutput> {
    const asOfDate = input.asOfDate ?? getTodayDate();
    const basis = input.basis ?? context.accountingBasis;
    const comparison = resolveBalanceSheetComparison(
      { ...input, asOfDate },
      context.fiscalYear,
    );

    const rows = await this.fetchAccountBalances(asOfDate, basis);

    const focus = this.resolveAccountFocus(rows, input);
    if (focus.kind === 'unresolved') {
      return focus.output;
    }

    const comparisonRows = comparison
      ? await this.fetchAccountBalances(comparison.asOfDate, basis)
      : undefined;

    const filters: IBalanceSheetResolvedFilters = {
      sections: (input.sections as BalanceSheetSectionId[] | undefined) ?? null,
      groupIds:
        (input.groupIds as BalanceSheetGroupFilterId[] | undefined) ?? null,
      accountIds: input.accountIds ?? null,
      accountQuery:
        focus.kind === 'resolved' ? (input.accountQuery ?? null) : null,
      ignoredAccountQuery:
        focus.kind === 'resolved' ? null : focus.ignoredAccountQuery,
      focusAccountIds: focus.kind === 'resolved' ? focus.accountIds : null,
      includeAccounts: input.includeAccounts ?? true,
      includeZeroBalances: input.includeZeroBalances ?? false,
      maxAccountsPerGroup:
        input.maxAccountsPerGroup ?? DEFAULT_MAX_ACCOUNTS_PER_GROUP,
    };

    return buildBalanceSheet({
      asOfDate,
      basis,
      currency: context.baseCurrency,
      rows,
      comparison:
        comparison && comparisonRows
          ? { ...comparison, rows: comparisonRows }
          : undefined,
      filters,
    });
  }

  /**
   * Fetches all accounts with their closing credit/debit totals through the
   * given date. The left join keeps accounts with no transactions so the
   * account tree stays complete.
   */
  private async fetchAccountBalances(
    date: string,
    basis: AccountingBasis,
  ): Promise<IBalanceSheetAccountBalanceRow[]> {
    const rows = await this.query<{
      id: number | string;
      code: string | null;
      name: string;
      account_type: string;
      parent_account_id: number | string | null;
      account_index: number | string | null;
      credit: string | number;
      debit: string | number;
    }>(
      `SELECT
        a.id AS id,
        a.code AS code,
        a.name AS name,
        a.account_type AS account_type,
        a.parent_account_id AS parent_account_id,
        a.\`index\` AS account_index,
        COALESCE(SUM(at.credit), 0) AS credit,
        COALESCE(SUM(at.debit), 0) AS debit
      FROM ACCOUNTS a
      LEFT JOIN ACCOUNTS_TRANSACTIONS at
        ON at.account_id = a.id
        AND at.date <= ?
        AND (at.basis IS NULL OR at.basis = ?)
      GROUP BY
        a.id,
        a.code,
        a.name,
        a.account_type,
        a.parent_account_id,
        a.\`index\`
      ORDER BY a.\`index\` ASC, a.name ASC`,
      [date, basis],
    );

    return rows.map((row) => ({
      id: Number(row.id),
      code: row.code,
      name: row.name,
      accountType: row.account_type,
      parentAccountId:
        row.parent_account_id == null ? null : Number(row.parent_account_id),
      index: toNumber(row.account_index),
      credit: toNumber(row.credit),
      debit: toNumber(row.debit),
    }));
  }

  /**
   * Resolves the optional account focus filter.
   */
  private resolveAccountFocus(
    rows: IBalanceSheetAccountBalanceRow[],
    input: BalanceSheetToolInput,
  ): AccountFocusResolution {
    if (!input.accountIds?.length && !input.accountQuery) {
      return { kind: 'none', ignoredAccountQuery: null };
    }

    if (input.accountIds?.length) {
      const ids = [
        ...new Set(
          input.accountIds
            .map((id) => Number(id))
            .filter((id) => Number.isInteger(id) && id > 0),
        ),
      ];
      const accounts = rows.filter((row) => ids.includes(row.id));

      if (accounts.length > 0) {
        const profitAndLossAccount = accounts.find(
          (account) => !this.isBalanceSheetAccountType(account.accountType),
        );
        if (profitAndLossAccount) {
          return this.unresolved(
            'not_found',
            accounts.map((account) => this.toAccountMatch(account)),
            'At least one provided account is a profit-and-loss account, not a balance-sheet account. Use the profit and loss tools for those balances.',
          );
        }

        return {
          kind: 'resolved',
          accountIds: accounts.map((account) => account.id),
          ignoredAccountQuery: null,
        };
      }

      if (!input.accountQuery) {
        return this.unresolved(
          'not_found',
          [],
          'No accounts were found for the provided account IDs.',
        );
      }
    }

    if (!input.accountQuery) {
      return { kind: 'none', ignoredAccountQuery: null };
    }

    if (this.isGenericBalanceSheetQuery(input.accountQuery)) {
      return { kind: 'none', ignoredAccountQuery: input.accountQuery };
    }

    const query = input.accountQuery.trim().toLowerCase();
    const exactCode = rows.filter(
      (row) => (row.code ?? '').trim().toLowerCase() === query,
    );
    const exactName = rows.filter(
      (row) => row.name.trim().toLowerCase() === query,
    );
    const partial = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(query) ||
        (row.code ?? '').toLowerCase().includes(query),
    );
    const candidates = exactCode.length
      ? exactCode
      : exactName.length
        ? exactName
        : partial;

    if (candidates.length === 0) {
      return this.unresolved(
        'not_found',
        [],
        `No account matches "${input.accountQuery}". If the user asked for the whole balance sheet or a section/group, retry with accountQuery omitted. Otherwise, ask the user for the exact account name or code.`,
      );
    }

    const matches = candidates
      .slice(0, MAX_ACCOUNT_MATCHES)
      .map((account) => this.toAccountMatch(account));

    if (candidates.length > 1) {
      return this.unresolved(
        'ambiguous',
        matches,
        'Multiple accounts match. Ask the user which one to use before answering.',
      );
    }

    const account = candidates[0];
    if (!this.isBalanceSheetAccountType(account.accountType)) {
      return this.unresolved(
        'not_found',
        matches,
        'The matching account is a profit-and-loss account, not a balance-sheet account. Use the profit and loss tools for its balance.',
      );
    }

    return {
      kind: 'resolved',
      accountIds: [account.id],
      ignoredAccountQuery: null,
    };
  }

  private isGenericBalanceSheetQuery(query: string): boolean {
    const normalized = query
      .trim()
      .replace(/[.!?,;:]+$/g, '')
      .replace(/\s+/g, ' ');

    return GENERIC_BALANCE_SHEET_QUERY_PATTERN.test(normalized);
  }

  private isBalanceSheetAccountType(accountType: string): boolean {
    const group = BALANCE_SHEET_GROUP_BY_ACCOUNT_TYPE.get(accountType);
    return Boolean(group && group.id !== 'net-income');
  }

  private toAccountMatch(
    account: IBalanceSheetAccountBalanceRow,
  ): IAccountMatch {
    return {
      id: account.id,
      code: account.code,
      name: account.name,
      accountType: account.accountType,
      isBalanceSheetAccount: this.isBalanceSheetAccountType(
        account.accountType,
      ),
    };
  }

  private unresolved(
    reason: 'not_found' | 'ambiguous',
    matches: IAccountMatch[],
    message: string,
  ): AccountFocusResolution {
    return {
      kind: 'unresolved',
      output: {
        found: false,
        reason,
        matches,
        message,
      },
    };
  }
}
