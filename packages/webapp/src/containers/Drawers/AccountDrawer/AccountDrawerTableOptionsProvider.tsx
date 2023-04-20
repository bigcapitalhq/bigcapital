import React, { useState, useCallback } from 'react';

interface AccountDrawerTableOptionsContextValue {
  setFYCCurrencyType: () => void;
  setBCYCurrencyType: () => void;
  isFCYCurrencyType: boolean;
  isBCYCurrencyType: boolean;
  currencyType: ForeignCurrencyType;
}

const AccountDrawerTableOptionsContext = React.createContext(
  {} as AccountDrawerTableOptionsContextValue,
);

enum ForeignCurrencyTypes {
  FCY = 'FCY',
  BCY = 'BCY',
}
type ForeignCurrencyType = ForeignCurrencyTypes.FCY | ForeignCurrencyTypes.BCY;

function AccountDrawerTableOptionsProvider({
  initialCurrencyType = ForeignCurrencyTypes.FCY,
  ...props
}) {
  const [currencyType, setCurrentType] =
    useState<ForeignCurrencyType>(initialCurrencyType);

  const setFYCCurrencyType = useCallback(
    () => setCurrentType(ForeignCurrencyTypes.FCY),
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
    isFCYCurrencyType: currencyType === ForeignCurrencyTypes.FCY,
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
