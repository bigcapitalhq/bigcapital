// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';

import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { withSettingsActions } from '@/containers/Settings/withSettingsActions';
import { withSettings } from '@/containers/Settings/withSettings';
import { withBillsActions } from '@/containers/Purchases/Bills/BillsLanding/withBillsActions';

import { optionsMapToArray } from '@/utils';
import { flow } from 'fp-ts/function';

/**
 * bill number dialog's content.
 */

function BillNumberDialogContentInner({
  // #withSettings
  nextNumber,
  numberPrefix,

  // #withSettingsActions
  requestFetchOptions,
  requestSubmitOptions,

  // #withDialogActions
  closeDialog,

  // #withBillsActions
  setBillNumberChanged,
}) {
  const queryClient = useQueryClient();
  const fetchSettings = useQuery({
    queryKey: ['settings'],
    queryFn: () => requestFetchOptions({}),
  });

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => {
      return { key: option.key, ...option, group: 'bills' };
    });

    requestSubmitOptions({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('bill-number-form');
        setBillNumberChanged(true);

        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['settings'] });
        }, 250);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const handleClose = () => {
    closeDialog('bill-number-form');
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

export const BillNumberDialogContent = flow(
  withBillsActions,
  withSettings(({ billsettings }) => ({
    nextNumber: billsettings?.next_number,
    numberPrefix: billsettings?.number_prefix,
  })),
  withSettingsActions,
  withDialogActions,
)(BillNumberDialogContentInner);
