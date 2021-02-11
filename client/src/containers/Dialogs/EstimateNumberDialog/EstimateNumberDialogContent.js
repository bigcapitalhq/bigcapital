import React, { useCallback } from 'react';
import { DialogContent } from 'components';
import { useQuery, queryCache } from 'react-query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettings from 'containers/Settings/withSettings';
import withSettingsActions from 'containers/Settings/withSettingsActions';

import { compose, optionsMapToArray } from 'utils';

/**
 * Estimate number dialog's content.
 */

function EstimateNumberDialogContent({
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
      return { key: option.key, ...option, group: 'sales_estimates' };
    });
    requestSubmitOptions({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('estimate-number-form');

        setTimeout(() => {
          queryCache.invalidateQueries('settings');
          // setEstimateNumberChanged(true);
        }, 250);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const handleClose = useCallback(() => {
    closeDialog('estimate-number-form');
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
  withSettings(({ estimatesSettings }) => ({
    nextNumber: estimatesSettings?.nextNumber,
    numberPrefix: estimatesSettings?.numberPrefix,
  })),
)(EstimateNumberDialogContent);
