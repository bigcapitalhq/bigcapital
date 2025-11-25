// @ts-nocheck

import { AccountSelect } from "./AccountsMultiSelect";

// Filters accounts items.
export const accountPredicate = (
  query: string,
  account: AccountSelect,
  _index?: number,
  exactMatch?: boolean,
) => {
  const normalizedTitle = account.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};
