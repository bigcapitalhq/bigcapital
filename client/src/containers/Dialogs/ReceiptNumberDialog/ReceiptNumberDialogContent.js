import React, { useCallback } from 'react';
import { DialogContent } from 'components';
import { useQuery, queryCache } from 'react-query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from 'containers/Settings/withSettings';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withReceiptActions from 'containers/Sales/Receipt/withReceiptActions';

import { compose, optionsMapToArray } from 'utils';

/**
 * Receipt number dialog's content.
 */

function ReceiptNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,

  // #withSettingsActions
  requestFetchOptions,
  requestSubmitOptions,

  // #withDialogActions
  closeDialog,

  // #withReceiptActions
  setReceiptNumberChanged,
}) {
  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => {
      return { key: option.key, ...option, group: 'sales_receipts' };
    });

    requestSubmitOptions({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('receipt-number-form');

        setTimeout(() => {
          queryCache.invalidateQueries('settings');
          setReceiptNumberChanged(true);
        }, 250);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const handleClose = useCallback(() => {
    closeDialog('receipt-number-form');
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
  withSettings(({ receiptSettings }) => ({
    nextNumber: receiptSettings?.nextNumber,
    numberPrefix: receiptSettings?.numberPrefix,
  })),
  withReceiptActions,
)(ReceiptNumberDialogContent);
