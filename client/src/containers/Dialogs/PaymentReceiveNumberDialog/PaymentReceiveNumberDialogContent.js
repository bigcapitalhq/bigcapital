import React, { useCallback } from 'react';
import { DialogContent } from 'components';
import { useQuery, queryCache } from 'react-query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';
import withPaymentReceivesActions from 'containers/Sales/PaymentReceive/withPaymentReceivesActions';

import { compose, optionsMapToArray } from 'utils';

/**
 * payment receive number dialog's content.
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

  // #withPaymentReceivesActions
  setPaymentReceiveNumberChanged,
}) {
  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => {
      return { key: option.key, ...option, group: 'payment_receives' };
    });

    requestSubmitOptions({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('payment-receive-number-form');

        setTimeout(() => {
          queryCache.invalidateQueries('settings');
          setPaymentReceiveNumberChanged(true);
        }, 250);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const handleClose = useCallback(() => {
    closeDialog('payment-receive-number-form');
  }, [closeDialog]);


  return (
    <DialogContent isLoading={fetchSettings.isFetching}>
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
  withSettings(({ paymentReceiveSettings }) => ({
    nextNumber: paymentReceiveSettings?.nextNumber,
    numberPrefix: paymentReceiveSettings?.numberPrefix,
  })),
  withPaymentReceivesActions,
)(PaymentNumberDialogContent);
