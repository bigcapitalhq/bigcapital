interface SortableAccount {
  id: number;
  name?: string | null;
  code?: string | null;
  parentAccountId?: number | null;
}

const collator = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base',
});

/**
 * Chart order: accounts with a code by code, compared as numbers so that 1010
 * comes before 10001, then accounts without a code by name.
 */
export const compareAccountsByCode = (
  a: SortableAccount,
  b: SortableAccount,
): number => {
  const codeA = (a.code ?? '').trim();
  const codeB = (b.code ?? '').trim();

  if (codeA && !codeB) return -1;
  if (!codeA && codeB) return 1;

  return (
    collator.compare(codeA, codeB) ||
    collator.compare(a.name ?? '', b.name ?? '') ||
    a.id - b.id
  );
};

/**
 * Sorts accounts in chart order while keeping each subaccount right after its
 * parent: the accounts are walked depth first, and the accounts at each level,
 * the top level and the subaccounts of each parent, are sorted by code.
 *
 * A list in this order stays in chart order when nested, and reads as the
 * chart does when shown flat. An account whose parent is not in the list is
 * placed as a top-level one.
 * @param {T[]} accounts
 * @returns {T[]}
 */
export const sortAccountsByCode = <T extends SortableAccount>(
  accounts: T[],
): T[] => {
  const ids = new Set(accounts.map((account) => account.id));
  const childrenOf = new Map<number, T[]>();
  const roots: T[] = [];

  accounts.forEach((account) => {
    const parentId = account.parentAccountId;

    if (parentId && parentId !== account.id && ids.has(parentId)) {
      childrenOf.set(parentId, [...(childrenOf.get(parentId) ?? []), account]);
    } else {
      roots.push(account);
    }
  });

  const sorted: T[] = [];
  const visited = new Set<number>();

  const visit = (account: T) => {
    if (visited.has(account.id)) return;
    visited.add(account.id);
    sorted.push(account);

    [...(childrenOf.get(account.id) ?? [])]
      .sort(compareAccountsByCode)
      .forEach(visit);
  };
  [...roots].sort(compareAccountsByCode).forEach(visit);

  // Accounts caught in a parent cycle have no root to be reached from; keep
  // them rather than drop them.
  accounts
    .filter((account) => !visited.has(account.id))
    .sort(compareAccountsByCode)
    .forEach(visit);

  return sorted;
};
