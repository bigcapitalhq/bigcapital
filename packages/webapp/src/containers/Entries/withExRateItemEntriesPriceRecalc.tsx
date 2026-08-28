import { useFormikContext } from 'formik';
import { ComponentType, useCallback, useEffect } from 'react';
import { useAutoExRateContext } from './AutoExchangeProvider';
import { useUpdateEntriesOnExchangeRateChange } from './useUpdateEntriesOnExchangeRateChange';
import { useCurrentOrganizationBaseCurrency } from '@/hooks/query';

export interface WithExchangeRateItemEntriesPriceRecalcProps {
  onRecalcConfirm: (args: {
    exchangeRate: number;
    oldExchangeRate: number;
  }) => void;
}

/**
 * Re-calculate the item entries prices based on the old exchange rate.
 */
export function withExchangeRateItemEntriesPriceRecalc<P>(
  Component: ComponentType<P & WithExchangeRateItemEntriesPriceRecalcProps>,
): ComponentType<P> {
  return (props: P) => {
    const { setFieldValue } = useFormikContext<{ entries: unknown[] }>();
    const updateChangeExRate = useUpdateEntriesOnExchangeRateChange();

    return (
      <Component
        {...(props as P & WithExchangeRateItemEntriesPriceRecalcProps)}
        onRecalcConfirm={({ exchangeRate, oldExchangeRate }) => {
          setFieldValue(
            'entries',
            updateChangeExRate(oldExchangeRate, exchangeRate),
          );
        }}
      />
    );
  };
}

export interface WithExchangeRateFetchingLoadingProps {
  isLoading: boolean;
  inputGroupProps: { disabled: boolean };
}

/**
 * Injects the loading props to the exchange rate field.
 */
export function withExchangeRateFetchingLoading<P>(
  Component: ComponentType<P & WithExchangeRateFetchingLoadingProps>,
): ComponentType<P> {
  return (_props: P) => {
    const { isAutoExchangeRateLoading } = useAutoExRateContext();

    return (
      <Component
        {...(_props as P & WithExchangeRateFetchingLoadingProps)}
        isLoading={isAutoExchangeRateLoading}
        inputGroupProps={{
          disabled: isAutoExchangeRateLoading,
        }}
      />
    );
  };
}

interface CustomerWithCurrency {
  currencyCode: string;
}

/**
 * Updates the customer currency code and exchange rate once you update the customer
 * then change the state to fetch the realtime exchange rate of the new selected currency.
 */
export const useCustomerUpdateExRate = () => {
  const { setFieldValue, values } = useFormikContext<{
    exchangeRate: number | string;
  }>();
  const { setAutoExRateCurrency } = useAutoExRateContext();

  const updateEntriesOnExChange = useUpdateEntriesOnExchangeRateChange();
  const baseCurrency = useCurrentOrganizationBaseCurrency();

  const DEFAULT_EX_RATE = 1;

  return useCallback(
    (customer: CustomerWithCurrency) => {
      // Reset the auto exchange rate currency cycle.
      setAutoExRateCurrency(null);

      // If the customer's currency code equals the same base currency.
      if (customer.currencyCode === baseCurrency) {
        setFieldValue('exchangeRate', DEFAULT_EX_RATE + '');
        setFieldValue(
          'entries',
          updateEntriesOnExChange(Number(values.exchangeRate), DEFAULT_EX_RATE),
        );
      } else {
        // Sets the currency code to fetch exchange rate of the given currency code.
        setAutoExRateCurrency(customer?.currencyCode);
      }
    },
    [
      baseCurrency,
      setAutoExRateCurrency,
      setFieldValue,
      updateEntriesOnExChange,
      values.exchangeRate,
    ],
  );
};

interface UseSyncExRateToFormProps {
  onSynced?: () => void;
}

/**
 * Syncs the realtime exchange rate to the Formik form and then re-calculates
 * the entries rate based on the given new and old ex. rate.
 */
export const useSyncExRateToForm = ({ onSynced }: UseSyncExRateToFormProps) => {
  const { setFieldValue, values } = useFormikContext<{
    exchangeRate: number | string;
  }>();
  const { autoExRateCurrency, autoExchangeRate, isAutoExchangeRateLoading } =
    useAutoExRateContext();
  const updateEntriesOnExChange = useUpdateEntriesOnExchangeRateChange();

  // Sync the fetched real-time exchanage rate to the form.
  useEffect(() => {
    if (!isAutoExchangeRateLoading && autoExRateCurrency) {
      // Sets a default ex. rate to 1 in case the exchange rate service wasn't configured.
      // or returned an error from the server-side.
      const exchangeRate = autoExchangeRate?.exchangeRate || 1;

      setFieldValue('exchangeRate', exchangeRate + '');
      setFieldValue(
        'entries',
        updateEntriesOnExChange(Number(values.exchangeRate), exchangeRate),
      );
      onSynced?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    autoExchangeRate?.exchangeRate,
    autoExRateCurrency,
    isAutoExchangeRateLoading,
  ]);

  return null;
};
