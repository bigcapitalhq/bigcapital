import React, { useState, useCallback, useEffect } from 'react';
import { DialogContent } from 'components';
import { useQuery, queryCache } from 'react-query';

import ReferenceNumberForm from 'containers/JournalNumber/ReferenceNumberForm';

import withDialogActions from 'containers/Dialog/withDialogActions';
import withSettingsActions from 'containers/Settings/withSettingsActions';
import withSettings from 'containers/Settings/withSettings';
import withManualJournalsActions from 'containers/Accounting/withManualJournalsActions';

import { compose, optionsMapToArray } from 'utils';

/**
 * Journal number dialog's content.
 */
function JournalNumberDialogContent({
  // #withSettings
  nextNumber,
  numberPrefix,

  // #withSettingsActions
  requestFetchOptions,
  requestSubmitOptions,

  // #withDialogActions
  closeDialog,

  // #withManualJournalsActions
  setJournalNumberChanged,
}) {
  const [isChanged, setIsChanged] = useState(false);
  
  const fetchSettings = useQuery(
    ['settings', { group: 'manual_journal' }],
    () => requestFetchOptions({}),
    {
      onSuccess: () => {
        if (isChanged) {
          setJournalNumberChanged(true);
          setIsChanged(false);
        }
      }
    }
  );

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => ({
      key: option.key, ...option, group: 'manual_journals',
    }));

    requestSubmitOptions({ options }).then(() => {
      setSubmitting(false);
      setIsChanged(true);
      
      queryCache.invalidateQueries('settings');
      closeDialog('journal-number-form');
    }).catch(() => {
      setSubmitting(false);
    });
  };

  const handleClose = useCallback(() => {
    closeDialog('journal-number-form');
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
  withSettings(({ manualJournalsSettings }) => ({
    nextNumber: manualJournalsSettings?.nextNumber,
    numberPrefix: manualJournalsSettings?.numberPrefix,
  })),
  withManualJournalsActions,
)(JournalNumberDialogContent);