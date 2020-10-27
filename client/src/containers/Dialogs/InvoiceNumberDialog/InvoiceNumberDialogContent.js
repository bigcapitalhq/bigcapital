import React from 'react';
import { DialogContent } from 'components';
import { useQuery, queryCache } from 'react-query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';

import { compose, optionsMapToArray } from 'utils';

/**
 * invoice number dialog's content.
 */

function InvoiceNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,

  // #withSettingsActions
  requestFetchOptions,
  requestSubmitOptions,

  // #withDialogActions
  closeDialog,
}) {
  const fetchSettings = useQuery(['settings'], () => requestFetchOptions({}));

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => {
      return { key: option.key, ...option, group: 'sales_invoices' };
    });

    requestSubmitOptions({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('invoice-number-form');

        setTimeout(() => {
          queryCache.invalidateQueries('settings');
        }, 250);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const handleClose = () => {
    closeDialog('invoice-number-form');
  };

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
  withSettings(({ invoiceSettings }) => ({
    nextNumber: invoiceSettings?.next_number,
    numberPrefix: invoiceSettings?.number_prefix,
  })),

) (InvoiceNumberDialogContent);
