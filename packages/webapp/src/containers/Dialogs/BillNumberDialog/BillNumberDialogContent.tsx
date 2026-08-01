import { FormikHelpers } from 'formik';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { DialogContent } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import {
  withBillsActions,
  type WithBillsActionsProps,
} from '@/containers/Purchases/Bills/BillsLanding/withBillsActions';
import { useSaveSettings, useSettingsBills } from '@/hooks/query';
import { compose, optionsMapToArray } from '@/utils';

interface BillNumberDialogContentProps
  extends WithDialogActionsProps,
    WithBillsActionsProps {
  billNumberId?: number | null;
}

/**
 * bill number dialog's content.
 */
function BillNumberDialogContentInner({
  closeDialog,
}: BillNumberDialogContentProps): React.ReactElement {
  const { data: billSettings, isFetching: isSettingsFetching } =
    useSettingsBills();
  const nextNumber = billSettings?.nextNumber as string | number | undefined;
  const numberPrefix = billSettings?.numberPrefix as string | undefined;

  const { mutateAsync: saveSettings } = useSaveSettings();

  const handleSubmitForm = (
    values: ReferenceNumberFormValues,
    { setSubmitting }: FormikHelpers<ReferenceNumberFormValues>,
  ) => {
    const options = optionsMapToArray(values).map((option) => ({
      ...option,
      group: 'bills',
    }));

    saveSettings({ options })
      .then(() => {
        setSubmitting(false);
        closeDialog('bill-number-form');
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
      {/* Latent bug (preserved): original code passed `initialNumber` /
          `initialPrefix` props that `ReferenceNumberForm` never read, so the
          bill prefix/next-number were never seeded into the form. Replaced
          with `initialValues` to honor the obvious intent. */}
      <ReferenceNumberForm
        initialValues={{
          numberPrefix: (numberPrefix as string | undefined) ?? '',
          nextNumber: (nextNumber as string | undefined) ?? '',
        }}
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
