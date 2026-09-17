import { accountsKeys } from '../accounts/query-keys';
import { cashflowAccountsKeys } from '../cashflow-accounts/query-keys';
import { financialReportsKeys } from '../FinancialReports/query-keys';
import { bankingKeys } from './query-keys';
import type { QueryClient, QueryKey } from '@tanstack/react-query';

/**
 * Invalidates every banking / cashflow list by key PREFIX.
 *
 * The key factories take optional args (accountId, query) and place them in
 * the key, so calling them bare produces keys with trailing `undefined`
 * slots - e.g. [KEY, undefined, undefined]. React Query matches keys
 * element-by-element and `undefined` never partial-matches a number or an
 * object, so a bare-called key invalidates nothing. Slicing to the first
 * element gives a real prefix, which matches every account and every filter
 * combination - what the bare calls were meant to do.
 */
export const invalidateBankingQueries = (queryClient: QueryClient) => {
  const prefixes: QueryKey[] = [
    // Cashflow accounts + their transaction lists.
    cashflowAccountsKeys.all(),
    cashflowAccountsKeys.transactions().slice(0, 1),
    cashflowAccountsKeys.transactionsInfinity().slice(0, 1),
    cashflowAccountsKeys.uncategorizedInfinity().slice(0, 1),

    // Banking tabs + the tab count badges.
    bankingKeys.summaryMeta().slice(0, 1),
    bankingKeys.recognizedTransactionsInfinity().slice(0, 1),
    bankingKeys.excludedTransactionsInfinity().slice(0, 1),
    bankingKeys.pendingTransactionsInfinity().slice(0, 1),
    bankingKeys.pendingTransactions(),

    // Ledger side.
    accountsKeys.all(),
    financialReportsKeys.all(),
  ];
  prefixes.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
};
