import React from 'react';
import { DialogContent } from 'components';
import { useQuery, queryCache } from 'react-query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';
import withPaymentMadeActions from 'containers/Purchases/PaymentMades/withPaymentMadeActions';

import { compose, optionsMapToArray } from 'utils';

/**
 * payment number dialog's content.
 */

function PaymentNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,

  // #withSettingsActions
  requestFetchOptions,
  requestSubmitOptions,

  // #withDialogActions
  closeDialog,
  // #withPaymentMadeActions
  setPaymentNumberChange,
}) {
  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => {
      return { key: option.key, ...option, group: 'bill_payments' };
    });

    requestSubmitOptions({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('payment-number-form');
        setPaymentNumberChange(true);

        setTimeout(() => {
          queryCache.invalidateQueries('settings');
        }, 250);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };
  const handleClose = () => {
    closeDialog('payment-number-form');
  };
  return (
    <DialogContent
     isLoading={fetchSettings.isFetching}
    >
      <ReferenceNumberForm
        initialNumber={nextNumber}
        initialPrefix={numberPrefix}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
      />
    </DialogContent>
  );
}

export default compose(
  withDialogActions,
  withSettingsActions,
  withSettings(({ billPaymentSettings }) => ({
    nextNumber: billPaymentSettings?.next_number,
    numberPrefix: billPaymentSettings?.number_prefix,
  })),
  withPaymentMadeActions,
)(PaymentNumberDialogContent);
