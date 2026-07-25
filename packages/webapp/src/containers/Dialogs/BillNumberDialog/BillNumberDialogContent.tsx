// @ts-nocheck
import React from 'react';
import { DialogContent } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import { withBillsActions } from '@/containers/Purchases/Bills/BillsLanding/withBillsActions';
import { useSaveSettings, useSettingsBills } from '@/hooks/query';
import { compose, optionsMapToArray } from '@/utils';

/**
 * bill number dialog's content.
 */

function BillNumberDialogContentInner({
  // #withDialogActions
  closeDialog,

  // #withBillsActions
  setBillNumberChanged,
}) {
  const { data: billSettings, isFetching: isSettingsFetching } =
    useSettingsBills();
  const nextNumber = billSettings?.nextNumber as number | undefined;
  const numberPrefix = billSettings?.numberPrefix as string | undefined;

  const { mutateAsync: saveSettings } = useSaveSettings();

  const handleSubmitForm = (values, { setSubmitting }) => {
    const options = optionsMapToArray(values).map((option) => {
      return { key: option.key, ...option, group: 'bills' };
    });

    saveSettings({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('bill-number-form');
        setBillNumberChanged(true);
      })
      .catch(() => {
        setSubmitting(false);
      });
  };

  const handleClose = () => {
    closeDialog('bill-number-form');
  };

  return (
    <DialogContent isLoading={isSettingsFetching}>
      <ReferenceNumberForm
        initialNumber={nextNumber}
        initialPrefix={numberPrefix}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
      />
    </DialogContent>
  );
}

export const BillNumberDialogContent = compose(
  withDialogActions,
  withBillsActions,
)(BillNumberDialogContentInner);
