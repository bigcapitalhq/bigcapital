import { useFormikContext } from 'formik';
import { isEmpty } from 'lodash';
import React, { createContext, useContext, useEffect } from 'react';
import { usePaymentMadeNewPageEntries } from 'hooks/query';
import { usePaymentMadeFormContext } from './PaymentMadeFormProvider';

const PaymentMadeInnerContext = createContext();

/**
 * Payment made inner form provider.
 */
function PaymentMadeInnerProvider({ ...props }) {
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
  });

  useEffect(() => {
    if (!isNewEntriesFetching && !isEmpty(newPageEntries)) {
      setFieldValue('entries', newPageEntries)
    }
  }, [isNewEntriesFetching, newPageEntries, setFieldValue]);

  // Provider payload.
  const provider = {
    newPageEntries,
    isNewEntriesLoading,
    isNewEntriesFetching
  };

  return <PaymentMadeInnerContext.Provider value={provider} {...props} />;
}

const usePaymentMadeInnerContext = () => useContext(PaymentMadeInnerContext);

export { PaymentMadeInnerProvider, usePaymentMadeInnerContext };
