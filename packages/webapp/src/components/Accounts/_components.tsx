// @ts-nocheck

// Filters accounts items.
export const accountPredicate = (query, account, _index, exactMatch) => {
  const normalizedTitle = account.name.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedTitle === normalizedQuery;
  } else {
    return `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
  }
};
