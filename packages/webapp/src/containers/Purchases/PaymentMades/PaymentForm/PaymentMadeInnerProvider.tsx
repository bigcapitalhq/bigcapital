// @ts-nocheck
import React, { createContext, useContext, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { usePaymentMadeNewPageEntries } from '@/hooks/query';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';
import { transformToNewPageEntries } from './utils';

const PaymentMadeInnerContext = createContext();

/**
 * Payment made inner form provider.
 */
function PaymentMadeInnerProvider({ ...props }) {
  // Payment made form context.
  const { isNewMode } = usePaymentMadeFormContext();

  // Formik context.
  const {
    values: { vendor_id: vendorId },
    setFieldValue,
  } = useFormikContext();

  const {
    data: newPageEntries,
    isLoading: isNewEntriesLoading,
    isFetching: isNewEntriesFetching,
  } = usePaymentMadeNewPageEntries(vendorId, {
    enabled: !!vendorId && isNewMode,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (!isNewEntriesFetching && newPageEntries && isNewMode) {
      setFieldValue('entries', transformToNewPageEntries(newPageEntries));
    }
  }, [isNewEntriesFetching, newPageEntries, isNewMode, setFieldValue]);

  // Provider payload.
  const provider = {
    newPageEntries,
    isNewEntriesLoading,
    isNewEntriesFetching,
  };

  return <PaymentMadeInnerContext.Provider value={provider} {...props} />;
}

const usePaymentMadeInnerContext = () => useContext(PaymentMadeInnerContext);

export { PaymentMadeInnerProvider, usePaymentMadeInnerContext };
