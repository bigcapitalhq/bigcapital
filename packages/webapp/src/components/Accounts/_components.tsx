import { AccountSelectModel } from './AccountsMultiSelect';

// Filters accounts items.
export const accountPredicate = (
  query: string,
  account: AccountSelectModel,
  _index?: number,
  exactMatch?: boolean,
): boolean => {
  const normalizedTitle = account?.name?.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};
