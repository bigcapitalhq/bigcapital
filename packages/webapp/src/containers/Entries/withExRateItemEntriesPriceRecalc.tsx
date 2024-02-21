// @ts-nocheck
import { useFormikContext } from 'formik';
import { useUpdateEntriesOnExchangeRateChange } from './useUpdateEntriesOnExchangeRateChange';
import { useAutoExRateContext } from './AutoExchangeProvider';
import { useCallback, useEffect } from 'react';
import { useCurrentOrganization } from '@/hooks/state';

/**
 * Re-calculate the item entries prices based on the old exchange rate.
 * @param {InvoiceExchangeRateInputFieldRoot} Component
 * @returns {JSX.Element}
 */
export const withExchangeRateItemEntriesPriceRecalc =
  (Component) => (props) => {
    const { setFieldValue } = useFormikContext();
    const updateChangeExRate = useUpdateEntriesOnExchangeRateChange();

    return (
      <Component
        onRecalcConfirm={({ exchangeRate, oldExchangeRate }) => {
          setFieldValue(
            'entries',
            updateChangeExRate(oldExchangeRate, exchangeRate),
          );
        }}
        {...props}
      />
    );
  };

/**
 * Injects the loading props to the exchange rate field.
 * @param Component
 * @returns {}
 */
export const withExchangeRateFetchingLoading = (Component) => (props) => {
  const { isAutoExchangeRateLoading } = useAutoExRateContext();

  return (
    <Component
      isLoading={isAutoExchangeRateLoading}
      inputGroupProps={{
        disabled: isAutoExchangeRateLoading,
      }}
    />
  );
};

/**
 * Updates the customer currency code and exchange rate once you update the customer
 * then change the state to fetch the realtime exchange rate of the new selected currency.
 */
export const useCustomerUpdateExRate = () => {
  const { setFieldValue, values } = useFormikContext();
  const { setAutoExRateCurrency } = useAutoExRateContext();

  const updateEntriesOnExChange = useUpdateEntriesOnExchangeRateChange();
  const currentCompany = useCurrentOrganization();

  const DEFAULT_EX_RATE = 1;

  return useCallback(
    (customer) => {
      // Reset the auto exchange rate currency cycle.
      setAutoExRateCurrency(null);

      // If the customer's currency code equals the same base currency.
      if (customer.currency_code === currentCompany.base_currency) {
        setFieldValue('exchange_rate', DEFAULT_EX_RATE + '');
        setFieldValue(
          'entries',
          updateEntriesOnExChange(values.exchange_rate, DEFAULT_EX_RATE),
        );
      } else {
        // Sets the currency code to fetch exchange rate of the given currency code.
        setAutoExRateCurrency(customer?.currency_code);
      }
    },
    [
      currentCompany.base_currency,
      setAutoExRateCurrency,
      setFieldValue,
      updateEntriesOnExChange,
      values.exchange_rate,
    ],
  );
};

interface UseSyncExRateToFormProps {
  onSynced?: () => void;
}

/**
 * Syncs the realtime exchange rate to the Formik form and then re-calculates
 * the entries rate based on the given new and old ex. rate.
 * @param {UseSyncExRateToFormProps} props -
 * @returns {React.ReactNode}
 */
export const useSyncExRateToForm = ({ onSynced }: UseSyncExRateToFormProps) => {
  const { setFieldValue, values } = useFormikContext();
  const { autoExRateCurrency, autoExchangeRate, isAutoExchangeRateLoading } =
    useAutoExRateContext();
  const updateEntriesOnExChange = useUpdateEntriesOnExchangeRateChange();

  // Sync the fetched real-time exchanage rate to the form.
  useEffect(() => {
    if (!isAutoExchangeRateLoading && autoExRateCurrency) {
      // Sets a default ex. rate to 1 in case the exchange rate service wasn't configured.
      // or returned an error from the server-side.
      const exchangeRate = autoExchangeRate?.exchange_rate || 1;

      setFieldValue('exchange_rate', exchangeRate + '');
      setFieldValue(
        'entries',
        updateEntriesOnExChange(values.exchange_rate, exchangeRate),
      );
      onSynced?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    autoExchangeRate?.exchange_rate,
    autoExRateCurrency,
    isAutoExchangeRateLoading,
  ]);

  return null;
};
