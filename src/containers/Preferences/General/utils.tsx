// @ts-nocheck
import { defaultFastFieldShouldUpdate } from '@/utils';

export const shouldBaseCurrencyUpdate = (newProps, oldProps) => {
  return (
    newProps.baseCurrencyDisabled !== oldProps.baseCurrencyDisabled ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};
