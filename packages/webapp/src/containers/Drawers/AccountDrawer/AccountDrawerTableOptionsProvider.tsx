import React, { useState, useCallback } from 'react';

interface AccountDrawerTableOptionsContextValue {
  setFYCCurrencyType: () => void;
  setBCYCurrencyType: () => void;
  isFYCCurrencyType: boolean;
  isBCYCurrencyType: boolean;
  currencyType: ForeignCurrencyType;
}

const AccountDrawerTableOptionsContext = React.createContext(
  {} as AccountDrawerTableOptionsContextValue,
);

enum ForeignCurrencyTypes {
  FYC = 'FYC',
  BCY = 'BCY',
}
type ForeignCurrencyType = ForeignCurrencyTypes.FYC | ForeignCurrencyTypes.BCY;

function AccountDrawerTableOptionsProvider({
  initialCurrencyType = ForeignCurrencyTypes.FYC,
  ...props
}) {
  const [currencyType, setCurrentType] =
    useState<ForeignCurrencyType>(initialCurrencyType);

  const setFYCCurrencyType = useCallback(
    () => setCurrentType(ForeignCurrencyTypes.FYC),
    [setCurrentType],
  );
  const setBCYCurrencyType = useCallback(
    () => setCurrentType(ForeignCurrencyTypes.BCY),
    [setCurrentType],
  );

  // Provider.
  const provider = {
    setFYCCurrencyType,
    setBCYCurrencyType,
    isFYCCurrencyType: currencyType === ForeignCurrencyTypes.FYC,
    isBCYCurrencyType: currencyType === ForeignCurrencyTypes.BCY,
    currencyType,
  };

  return (
    <AccountDrawerTableOptionsContext.Provider value={provider} {...props} />
  );
}

const useAccountDrawerTableOptionsContext = () =>
  React.useContext(AccountDrawerTableOptionsContext);

export {
  AccountDrawerTableOptionsProvider,
  useAccountDrawerTableOptionsContext,
};
