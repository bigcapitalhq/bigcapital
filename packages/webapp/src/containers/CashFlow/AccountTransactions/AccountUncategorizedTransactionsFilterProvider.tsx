import React from 'react';

interface UncategorizedTransactionsFilterValue {}

const UncategorizedTransactionsFilterContext =
  React.createContext<UncategorizedTransactionsFilterValue>(
    {} as UncategorizedTransactionsFilterValue,
  );

interface UncategorizedTransactionsFilterProviderProps {
  children: React.ReactNode;
}

/**
 *
 */
function UncategorizedTransactionsFilterProvider({
  ...props
}: UncategorizedTransactionsFilterProviderProps) {
  // Provider payload.
  const provider = {};

  return (
    <UncategorizedTransactionsFilterContext.Provider
      value={provider}
      {...props}
    />
  );
}

const useUncategorizedTransactionsFilter = () =>
  React.useContext(UncategorizedTransactionsFilterContext);

export {
  UncategorizedTransactionsFilterProvider,
  useUncategorizedTransactionsFilter,
};
