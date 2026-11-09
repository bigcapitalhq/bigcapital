import { defaultFastFieldShouldUpdate } from '@/utils';

export interface ShouldBaseCurrencyUpdateProps {
  baseCurrencyDisabled?: boolean;
  [key: string]: unknown;
}

export const shouldBaseCurrencyUpdate = (
  newProps: ShouldBaseCurrencyUpdateProps,
  oldProps: ShouldBaseCurrencyUpdateProps,
) => {
  return (
    newProps.baseCurrencyDisabled !== oldProps.baseCurrencyDisabled ||
    defaultFastFieldShouldUpdate(newProps, oldProps)
  );
};
