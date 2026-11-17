import { AccountingBasis } from '@/common/types/AccountingBasis';
import { ACCOUNT_PARENT_TYPE, ACCOUNT_TYPES } from '@/constants/accounts';
import { percentage, round } from '../utils/number';
import {
  BALANCE_SHEET_CURRENT_ASSET_GROUP_IDS,
  BALANCE_SHEET_GROUP_BY_ACCOUNT_TYPE,
  BALANCE_SHEET_GROUP_BY_ID,
  BALANCE_SHEET_GROUPS,
  BALANCE_SHEET_GROUPS_BY_SECTION,
  BALANCE_SHEET_SECTION_IDS,
  BALANCE_SHEET_SECTION_NAMES,
  type BalanceSheetComparisonMode,
  type BalanceSheetGroupFilterId,
  type BalanceSheetGroupId,
  type BalanceSheetSectionId,
  type BalanceSheetSuccessOutput,
  type IBalanceSheetGroupConfig,
} from './AiBalanceSheet.schema';

const BALANCE_TOLERANCE = 0.01;

const isBalancedDifference = (difference: number): boolean =>
  Math.abs(difference) <= BALANCE_TOLERANCE;

const ACCOUNT_NORMAL_BY_TYPE = new Map(
  ACCOUNT_TYPES.map((type) => [type.key, type.normal]),
);

const INCOME_ACCOUNT_TYPES = new Set(
  ACCOUNT_TYPES.filter(
    (type) => type.parentType === ACCOUNT_PARENT_TYPE.INCOME,
  ).map((type) => type.key),
);

const EXPENSE_ACCOUNT_TYPES = new Set(
  ACCOUNT_TYPES.filter(
    (type) => type.parentType === ACCOUNT_PARENT_TYPE.EXPENSE,
  ).map((type) => type.key),
);

export interface IBalanceSheetAccountBalanceRow {
  id: number;
  code: string | null;
  name: string;
  accountType: string;
  parentAccountId: number | null;
  index: number;
  credit: number;
  debit: number;
}

export interface IBalanceSheetComparisonInput {
  asOfDate: string;
  mode: BalanceSheetComparisonMode;
  rows: IBalanceSheetAccountBalanceRow[];
}

export interface IBalanceSheetResolvedFilters {
  sections: BalanceSheetSectionId[] | null;
  groupIds: BalanceSheetGroupFilterId[] | null;
  accountIds: number[] | null;
  accountQuery: string | null;
  ignoredAccountQuery: string | null;
  focusAccountIds: number[] | null;
  includeAccounts: boolean;
  includeZeroBalances: boolean;
  maxAccountsPerGroup: number;
}

export interface IBalanceSheetBuilderInput {
  asOfDate: string;
  basis: AccountingBasis;
  currency: string;
  rows: IBalanceSheetAccountBalanceRow[];
  comparison?: IBalanceSheetComparisonInput;
  filters: IBalanceSheetResolvedFilters;
}

interface IBalanceSheetSnapshot {
  accountsById: Map<number, IBalanceSheetAccountBalanceRow>;
  childrenByParent: Map<number, number[]>;
  ownById: Map<number, number>;
  totalById: Map<number, number>;
  depthById: Map<number, number>;
  groupAccountsById: Map<BalanceSheetGroupId, IBalanceSheetAccountBalanceRow[]>;
  groupTotals: Map<BalanceSheetGroupId, number>;
  sectionTotals: Record<BalanceSheetSectionId, number>;
  netIncome: {
    income: number;
    expenses: number;
    netIncome: number;
  };
}

interface IGroupAccountRows {
  rows: IBalanceSheetAccountBalanceRow[];
  accountCount: number;
  accountsTruncated: boolean;
}

const signedAmount = (
  accountType: string,
  credit: number,
  debit: number,
): number => {
  const normal = ACCOUNT_NORMAL_BY_TYPE.get(accountType);

  // Match the canonical report: unrecognized account types have no normal
  // side, so their own amounts are ignored. Descendants still roll up.
  if (normal === 'credit') {
    return credit - debit;
  }
  if (normal === 'debit') {
    return debit - credit;
  }
  return 0;
};

const sum = (values: number[]): number => {
  return values.reduce((total, value) => total + value, 0);
};

/**
 * Builds the in-memory account tree and derives balances.
 *
 * Parent account balances include descendants so group totals match the
 * canonical balance sheet report. Own balances stay separate so account rows
 * can be displayed without double-counting.
 */
const buildSnapshot = (
  rows: IBalanceSheetAccountBalanceRow[],
): IBalanceSheetSnapshot => {
  const accountsById = new Map<number, IBalanceSheetAccountBalanceRow>();
  rows.forEach((row) => accountsById.set(row.id, row));

  const childrenByParent = new Map<number, number[]>();
  accountsById.forEach((account) => {
    const parentId = account.parentAccountId;
    if (!parentId || !accountsById.has(parentId) || parentId === account.id) {
      return;
    }
    const children = childrenByParent.get(parentId) ?? [];
    children.push(account.id);
    childrenByParent.set(parentId, children);
  });

  const ownById = new Map<number, number>();
  accountsById.forEach((account) => {
    ownById.set(
      account.id,
      signedAmount(account.accountType, account.credit, account.debit),
    );
  });

  const totalById = new Map<number, number>();
  const resolving = new Set<number>();
  const resolveTotal = (accountId: number): number => {
    const cached = totalById.get(accountId);
    if (cached !== undefined) {
      return cached;
    }
    if (resolving.has(accountId)) {
      return ownById.get(accountId) ?? 0;
    }

    resolving.add(accountId);
    const children = childrenByParent.get(accountId) ?? [];
    const total =
      (ownById.get(accountId) ?? 0) +
      sum(children.map((childId) => resolveTotal(childId)));
    resolving.delete(accountId);

    totalById.set(accountId, total);
    return total;
  };
  accountsById.forEach((account) => resolveTotal(account.id));

  const depthById = new Map<number, number>();
  const resolvingDepth = new Set<number>();
  const resolveDepth = (accountId: number): number => {
    const cached = depthById.get(accountId);
    if (cached !== undefined) {
      return cached;
    }
    if (resolvingDepth.has(accountId)) {
      return 0;
    }

    resolvingDepth.add(accountId);
    const parentId = accountsById.get(accountId)?.parentAccountId;
    const depth =
      parentId && accountsById.has(parentId) && parentId !== accountId
        ? resolveDepth(parentId) + 1
        : 0;
    resolvingDepth.delete(accountId);

    depthById.set(accountId, depth);
    return depth;
  };
  accountsById.forEach((account) => resolveDepth(account.id));

  const groupAccountsById = new Map<
    BalanceSheetGroupId,
    IBalanceSheetAccountBalanceRow[]
  >();
  BALANCE_SHEET_GROUPS.forEach((group) => {
    groupAccountsById.set(group.id, []);
  });
  accountsById.forEach((account) => {
    const group = BALANCE_SHEET_GROUP_BY_ACCOUNT_TYPE.get(account.accountType);
    if (!group) {
      return;
    }
    const accounts = groupAccountsById.get(group.id);
    if (accounts) {
      accounts.push(account);
    }
  });

  const groupTotals = new Map<BalanceSheetGroupId, number>();
  let netIncome = {
    income: 0,
    expenses: 0,
    netIncome: 0,
  };

  BALANCE_SHEET_GROUPS.forEach((group) => {
    const groupAccounts = groupAccountsById.get(group.id) ?? [];

    if (group.isNetIncome) {
      // Match the canonical report: net income is the sum of all income and
      // expense account own balances, independent of how the type is grouped.
      const accounts = [...accountsById.values()];
      const income = sum(
        accounts
          .filter((account) => INCOME_ACCOUNT_TYPES.has(account.accountType))
          .map((account) => ownById.get(account.id) ?? 0),
      );
      const expenses = sum(
        accounts
          .filter((account) => EXPENSE_ACCOUNT_TYPES.has(account.accountType))
          .map((account) => ownById.get(account.id) ?? 0),
      );

      netIncome = {
        income: round(income),
        expenses: round(expenses),
        netIncome: round(income - expenses),
      };
      groupTotals.set(group.id, netIncome.netIncome);
      return;
    }

    const groupAccountIds = new Set(groupAccounts.map((account) => account.id));
    const roots = groupAccounts.filter(
      (account) =>
        !account.parentAccountId ||
        !groupAccountIds.has(account.parentAccountId),
    );
    const total = sum(roots.map((account) => totalById.get(account.id) ?? 0));

    groupTotals.set(group.id, round(total));
  });

  const sectionTotals: Record<BalanceSheetSectionId, number> = {
    assets: 0,
    liabilities: 0,
    equity: 0,
  };
  BALANCE_SHEET_SECTION_IDS.forEach((sectionId) => {
    const totals = BALANCE_SHEET_GROUPS_BY_SECTION[sectionId].map(
      (groupId) => groupTotals.get(groupId) ?? 0,
    );
    sectionTotals[sectionId] = round(sum(totals));
  });

  return {
    accountsById,
    childrenByParent,
    ownById,
    totalById,
    depthById,
    groupAccountsById,
    groupTotals,
    sectionTotals,
    netIncome,
  };
};

const expandGroupFilters = (
  groupFilters: BalanceSheetGroupFilterId[] | null,
): Set<BalanceSheetGroupId> | null => {
  if (!groupFilters?.length) {
    return null;
  }
  const expanded = new Set<BalanceSheetGroupId>();

  groupFilters.forEach((groupId) => {
    if (groupId === 'current-assets') {
      BALANCE_SHEET_CURRENT_ASSET_GROUP_IDS.forEach((id) => expanded.add(id));
      return;
    }
    expanded.add(groupId);
  });
  return expanded;
};

const selectGroups = (
  filters: IBalanceSheetResolvedFilters,
): BalanceSheetGroupId[] => {
  const expandedGroupFilters = expandGroupFilters(filters.groupIds);
  const sectionFilter = filters.sections?.length
    ? new Set(filters.sections)
    : null;

  return BALANCE_SHEET_GROUPS.filter((group) => {
    if (sectionFilter && !sectionFilter.has(group.sectionId)) {
      return false;
    }
    if (expandedGroupFilters && !expandedGroupFilters.has(group.id)) {
      return false;
    }
    return true;
  }).map((group) => group.id);
};

const collectFocusAccountIds = (
  focusAccountIds: number[],
  snapshot: IBalanceSheetSnapshot,
): Set<number> => {
  const ids = new Set<number>();
  const visit = (accountId: number) => {
    if (ids.has(accountId)) {
      return;
    }
    ids.add(accountId);
    const children = snapshot.childrenByParent.get(accountId) ?? [];
    children.forEach(visit);
  };
  focusAccountIds.forEach(visit);
  return ids;
};

const getGroupAccountRows = (
  group: IBalanceSheetGroupConfig,
  snapshot: IBalanceSheetSnapshot,
  filters: IBalanceSheetResolvedFilters,
): IGroupAccountRows => {
  if (group.isNetIncome) {
    return { rows: [], accountCount: 0, accountsTruncated: false };
  }

  const includeAccounts =
    filters.includeAccounts || Boolean(filters.focusAccountIds?.length);
  if (!includeAccounts) {
    return { rows: [], accountCount: 0, accountsTruncated: false };
  }

  const groupAccounts = snapshot.groupAccountsById.get(group.id) ?? [];
  const focusSet = filters.focusAccountIds?.length
    ? collectFocusAccountIds(filters.focusAccountIds, snapshot)
    : null;
  const focusedIds = new Set(filters.focusAccountIds ?? []);

  const candidates = groupAccounts.filter((account) => {
    if (focusSet && !focusSet.has(account.id)) {
      return false;
    }

    const ownBalance = snapshot.ownById.get(account.id) ?? 0;
    const totalBalance = snapshot.totalById.get(account.id) ?? 0;
    const isDirectlyFocused = focusedIds.has(account.id);

    if (isDirectlyFocused) {
      return true;
    }
    // Pure parent accounts only repeat their children's balances.
    if (ownBalance === 0 && totalBalance !== 0) {
      return false;
    }
    if (ownBalance === 0 && totalBalance === 0) {
      return filters.includeZeroBalances;
    }
    return true;
  });

  const sorted = candidates.sort((left, right) => {
    const leftTotal = Math.abs(snapshot.totalById.get(left.id) ?? 0);
    const rightTotal = Math.abs(snapshot.totalById.get(right.id) ?? 0);
    if (leftTotal !== rightTotal) {
      return rightTotal - leftTotal;
    }
    return left.name.localeCompare(right.name);
  });

  // Directly focused accounts must survive the row limit even when their
  // descendants have larger balances.
  const focusedRows = sorted.filter((account) => focusedIds.has(account.id));
  const otherRows = sorted.filter((account) => !focusedIds.has(account.id));
  const rows = [...focusedRows, ...otherRows]
    .slice(0, filters.maxAccountsPerGroup)
    .sort((left, right) => {
      const leftTotal = Math.abs(snapshot.totalById.get(left.id) ?? 0);
      const rightTotal = Math.abs(snapshot.totalById.get(right.id) ?? 0);
      if (leftTotal !== rightTotal) {
        return rightTotal - leftTotal;
      }
      return left.name.localeCompare(right.name);
    });

  return {
    rows,
    accountCount: sorted.length,
    accountsTruncated: sorted.length > rows.length,
  };
};

const buildLineComparison = (
  currentBalance: number,
  previousBalance: number | undefined,
  comparison: IBalanceSheetComparisonInput | undefined,
) => {
  if (!comparison) {
    return undefined;
  }
  const previous = round(previousBalance ?? 0);
  const change = round(currentBalance - previous);

  return {
    asOfDate: comparison.asOfDate,
    previousBalance: previous,
    change,
    changePercentage: previous === 0 ? null : percentage(change, previous),
  };
};

const buildTotalsComparison = (
  snapshot: IBalanceSheetSnapshot,
  previousSnapshot: IBalanceSheetSnapshot,
  comparison: IBalanceSheetComparisonInput,
) => {
  const current = {
    assets: snapshot.sectionTotals.assets,
    liabilities: snapshot.sectionTotals.liabilities,
    equity: snapshot.sectionTotals.equity,
  };
  const previous = {
    assets: previousSnapshot.sectionTotals.assets,
    liabilities: previousSnapshot.sectionTotals.liabilities,
    equity: previousSnapshot.sectionTotals.equity,
  };

  const changeFor = (key: keyof typeof current) =>
    round(current[key] - previous[key]);
  const percentageFor = (key: keyof typeof current) =>
    previous[key] === 0
      ? null
      : percentage(current[key] - previous[key], previous[key]);

  const previousLiabilitiesAndEquity = round(
    previous.liabilities + previous.equity,
  );
  const previousDifference = round(
    previous.assets - previousLiabilitiesAndEquity,
  );
  const currentLiabilitiesAndEquity = round(
    current.liabilities + current.equity,
  );

  return {
    asOfDate: comparison.asOfDate,
    assets: round(previous.assets),
    liabilities: round(previous.liabilities),
    equity: round(previous.equity),
    liabilitiesAndEquity: previousLiabilitiesAndEquity,
    difference: previousDifference,
    isBalanced: isBalancedDifference(previousDifference),
    changes: {
      assets: changeFor('assets'),
      liabilities: changeFor('liabilities'),
      equity: changeFor('equity'),
      liabilitiesAndEquity: round(
        currentLiabilitiesAndEquity - previousLiabilitiesAndEquity,
      ),
    },
    percentageChanges: {
      assets: percentageFor('assets'),
      liabilities: percentageFor('liabilities'),
      equity: percentageFor('equity'),
      liabilitiesAndEquity:
        previousLiabilitiesAndEquity === 0
          ? null
          : percentage(
              currentLiabilitiesAndEquity - previousLiabilitiesAndEquity,
              previousLiabilitiesAndEquity,
            ),
    },
  };
};

const buildNotes = (
  snapshot: IBalanceSheetSnapshot,
  filters: IBalanceSheetResolvedFilters,
  currency: string,
  basis: AccountingBasis,
  comparison: IBalanceSheetComparisonInput | undefined,
  selectedGroups: BalanceSheetGroupId[],
  hasTruncatedAccounts: boolean,
): string[] => {
  const notes: string[] = [`All amounts are in ${currency}.`];

  if (filters.sections?.length || filters.groupIds?.length) {
    notes.push(
      'Section/group filters only limit displayed groups; section totals, percentages, and overall totals include the full balance sheet.',
    );
  }

  if (selectedGroups.length === 0) {
    notes.push('No balance-sheet groups matched the selected filters.');
  }

  if (filters.focusAccountIds?.length) {
    notes.push(
      'Results are focused on the matched account(s) and their descendants. Group totals still include all accounts.',
    );
  }

  if (filters.ignoredAccountQuery) {
    notes.push(
      `Ignored the account filter "${filters.ignoredAccountQuery}" because it describes the whole balance sheet. No account focus was applied.`,
    );
  }

  if (hasTruncatedAccounts) {
    notes.push(
      `Account rows are limited to the largest ${filters.maxAccountsPerGroup} per group; group totals include all accounts.`,
    );
  }

  if (!filters.includeAccounts && !filters.focusAccountIds?.length) {
    notes.push(
      'Account rows were not requested; only section and group totals are included.',
    );
  }

  if (filters.includeZeroBalances) {
    notes.push('Zero-balance accounts are included.');
  }

  if (basis === AccountingBasis.Cash) {
    notes.push(
      'Cash basis includes cash-basis entries and general ledger entries without an explicit basis.',
    );
  }

  if (selectedGroups.includes('net-income')) {
    notes.push(
      'Net income is cumulative through the as-of date and reflects any closing entries.',
    );
  }

  const difference = round(
    snapshot.sectionTotals.assets -
      (snapshot.sectionTotals.liabilities + snapshot.sectionTotals.equity),
  );
  if (!isBalancedDifference(difference)) {
    notes.push(
      `The balance sheet does not balance: assets differ from liabilities plus equity by ${difference}.`,
    );
  }

  const unknownTypes = new Set(
    [...snapshot.accountsById.values()]
      .filter(
        (account) =>
          !BALANCE_SHEET_GROUP_BY_ACCOUNT_TYPE.has(account.accountType) &&
          (account.credit !== 0 || account.debit !== 0),
      )
      .map((account) => account.accountType),
  );
  if (unknownTypes.size > 0) {
    notes.push(
      `Some accounts use unrecognized account types (${[...unknownTypes].join(
        ', ',
      )}) and their own balances are excluded; descendant balances still roll up through the account tree.`,
    );
  }

  if (comparison) {
    notes.push(`Compared with the balance sheet as of ${comparison.asOfDate}.`);
  }

  return notes;
};

/**
 * Builds the compact, structured balance sheet returned by the AI tool.
 */
export const buildBalanceSheet = (
  input: IBalanceSheetBuilderInput,
): BalanceSheetSuccessOutput => {
  const snapshot = buildSnapshot(input.rows);
  const comparisonSnapshot = input.comparison
    ? buildSnapshot(input.comparison.rows)
    : undefined;

  const selectedGroupIds = selectGroups(input.filters);
  const selectedGroups = selectedGroupIds.map(
    (groupId) =>
      BALANCE_SHEET_GROUP_BY_ID.get(groupId) as IBalanceSheetGroupConfig,
  );

  const effectiveIncludeAccounts =
    input.filters.includeAccounts ||
    Boolean(input.filters.focusAccountIds?.length);
  const effectiveFilters: IBalanceSheetResolvedFilters = {
    ...input.filters,
    includeAccounts: effectiveIncludeAccounts,
  };

  let hasTruncatedAccounts = false;

  const sections = BALANCE_SHEET_SECTION_IDS.filter((sectionId) =>
    selectedGroups.some((group) => group.sectionId === sectionId),
  ).map((sectionId) => {
    const sectionTotal = snapshot.sectionTotals[sectionId];
    const previousSectionTotal = comparisonSnapshot?.sectionTotals[sectionId];

    const groups = selectedGroups
      .filter((group) => group.sectionId === sectionId)
      .map((group) => {
        const groupTotal = snapshot.groupTotals.get(group.id) ?? 0;
        const previousGroupTotal = comparisonSnapshot
          ? (comparisonSnapshot.groupTotals.get(group.id) ?? 0)
          : undefined;
        const accountRows = getGroupAccountRows(
          group,
          snapshot,
          effectiveFilters,
        );

        if (accountRows.accountsTruncated) {
          hasTruncatedAccounts = true;
        }

        return {
          id: group.id,
          name: group.name,
          description: group.description,
          sectionId: group.sectionId,
          total: round(groupTotal),
          percentageOfSection: percentage(groupTotal, sectionTotal),
          accountCount: accountRows.accountCount,
          accountsReturned: accountRows.rows.length,
          accountsTruncated: accountRows.accountsTruncated,
          accounts: accountRows.rows.map((account) => {
            const ownBalance = snapshot.ownById.get(account.id) ?? 0;
            const totalBalance = snapshot.totalById.get(account.id) ?? 0;

            return {
              id: account.id,
              code: account.code,
              name: account.name,
              accountType: account.accountType,
              parentId: account.parentAccountId,
              depth: snapshot.depthById.get(account.id) ?? 0,
              hasChildren:
                (snapshot.childrenByParent.get(account.id)?.length ?? 0) > 0,
              ownBalance: round(ownBalance),
              balance: round(totalBalance),
              percentageOfGroup: percentage(totalBalance, groupTotal),
              comparison: buildLineComparison(
                totalBalance,
                comparisonSnapshot?.totalById.get(account.id),
                input.comparison,
              ),
            };
          }),
          netIncomeBreakdown: group.isNetIncome
            ? snapshot.netIncome
            : undefined,
          comparison: buildLineComparison(
            groupTotal,
            previousGroupTotal,
            input.comparison,
          ),
        };
      });

    return {
      id: sectionId,
      name: BALANCE_SHEET_SECTION_NAMES[sectionId],
      total: round(sectionTotal),
      comparison: buildLineComparison(
        sectionTotal,
        previousSectionTotal,
        input.comparison,
      ),
      groups,
    };
  });

  const liabilitiesAndEquity = round(
    snapshot.sectionTotals.liabilities + snapshot.sectionTotals.equity,
  );
  const difference = round(
    snapshot.sectionTotals.assets - liabilitiesAndEquity,
  );

  return {
    found: true,
    asOfDate: input.asOfDate,
    basis: input.basis,
    currency: input.currency,
    comparison: input.comparison
      ? {
          asOfDate: input.comparison.asOfDate,
          mode: input.comparison.mode,
        }
      : null,
    appliedFilters: {
      sections: input.filters.sections,
      groupIds: input.filters.groupIds,
      accountIds: input.filters.accountIds,
      accountQuery: input.filters.accountQuery,
      ignoredAccountQuery: input.filters.ignoredAccountQuery,
      resolvedAccountIds: input.filters.focusAccountIds,
      includeAccounts: effectiveIncludeAccounts,
      includeZeroBalances: input.filters.includeZeroBalances,
      maxAccountsPerGroup: input.filters.maxAccountsPerGroup,
    },
    totals: {
      assets: round(snapshot.sectionTotals.assets),
      liabilities: round(snapshot.sectionTotals.liabilities),
      equity: round(snapshot.sectionTotals.equity),
      liabilitiesAndEquity,
      difference,
      isBalanced: isBalancedDifference(difference),
      comparison:
        comparisonSnapshot && input.comparison
          ? buildTotalsComparison(
              snapshot,
              comparisonSnapshot,
              input.comparison,
            )
          : undefined,
    },
    sections,
    notes: buildNotes(
      snapshot,
      effectiveFilters,
      input.currency,
      input.basis,
      input.comparison,
      selectedGroupIds,
      hasTruncatedAccounts,
    ),
  };
};
