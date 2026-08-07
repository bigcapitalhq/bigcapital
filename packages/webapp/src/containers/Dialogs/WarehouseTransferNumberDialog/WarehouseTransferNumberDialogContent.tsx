import { FormikHelpers } from 'formik';
import React from 'react';
import intl from 'react-intl-universal';
import { WarehouseTransferNumberDialogProvider } from './WarehouseTransferNumberDialogProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { ReferenceNumberFormValues } from '@/containers/JournalNumber/types';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';
import { useSaveSettings, useSettingsWarehouseTransfers } from '@/hooks/query';
import { compose } from '@/utils';

interface WarehouseTransferNumberDialogContentProps
  extends WithDialogActionsProps {
  initialValues?: Partial<ReferenceNumberFormValues>;
  onConfirm?: (values: ReferenceNumberFormValues) => void;
}

function WarehouseTransferNumberDialogContentInner({
  initialValues,
  onConfirm,
  closeDialog,
}: WarehouseTransferNumberDialogContentProps): React.ReactElement {
  const { data: warehouseTransferSettings } = useSettingsWarehouseTransfers();
  const nextNumber = warehouseTransferSettings?.nextNumber as
    | string
    | number
    | undefined;
  const numberPrefix = warehouseTransferSettings?.numberPrefix as
    | string
    | undefined;
  const autoIncrement = warehouseTransferSettings?.autoIncrement as
    | boolean
    | string
    | undefined;

  const { mutateAsync: saveSettings } = useSaveSettings();
  const [referenceFormValues, setReferenceFormValues] =
    React.useState<Partial<ReferenceNumberFormValues> | null>(null);

  const handleSubmitForm = (
    values: ReferenceNumberFormValues,
    { setSubmitting }: FormikHelpers<ReferenceNumberFormValues>,
  ) => {
    const handleSuccess = () => {
      setSubmitting(false);
      closeDialog('warehouse-transfer-no-form');
      onConfirm?.(values);
    };

    const handleErrors = () => {
      setSubmitting(false);
    };

    if (values.incrementMode === 'manual-transaction') {
      handleSuccess();
      return;
    }
    const options = transformFormToSettings(values, 'warehouse_transfers');

    saveSettings({ options }).then(handleSuccess).catch(handleErrors);
  };

  const handleClose = () => {
    closeDialog('warehouse-transfer-no-form');
  };

  const handleChange = (values: ReferenceNumberFormValues) => {
    setReferenceFormValues(values);
  };

  const description =
    referenceFormValues?.incrementMode === 'auto'
      ? intl.get('warehouse_transfer.auto_increment.auto')
      : intl.get('warehouse_transfer.auto_increment.manually');

  return (
    <WarehouseTransferNumberDialogProvider>
      <ReferenceNumberForm
        initialValues={{
          ...transformSettingsToForm({
            nextNumber,
            numberPrefix,
            autoIncrement,
          }),
          ...initialValues,
        }}
        description={description}
        onSubmit={handleSubmitForm}
        onClose={handleClose}
        onChange={handleChange}
      />
    </WarehouseTransferNumberDialogProvider>
  );
}
export const WarehouseTransferNumberDialogContent = compose(withDialogActions)(
  WarehouseTransferNumberDialogContentInner,
);
