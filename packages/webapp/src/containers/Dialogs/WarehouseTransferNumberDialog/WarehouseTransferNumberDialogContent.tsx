import React from 'react';
import intl from 'react-intl-universal';
import { WarehouseTransferNumberDialogProvider } from './WarehouseTransferNumberDialogProvider';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import type { FormikHelpers } from 'formik';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { ReferenceNumberForm } from '@/containers/JournalNumber/ReferenceNumberForm';
import {
  transformFormToSettings,
  transformSettingsToForm,
} from '@/containers/JournalNumber/utils';
import { withSettings } from '@/containers/Settings/withSettings';
import { withSettingsActions } from '@/containers/Settings/withSettingsActions';
import { useSaveSettings } from '@/hooks/query';
import { compose } from '@/utils';

interface ReferenceFormValues {
  incrementMode?: string;
  [key: string]: unknown;
}

interface WarehouseTransferNumberDialogContentProps
  extends WithDialogActionsProps {
  initialValues?: Record<string, unknown>;
  onConfirm?: (values: ReferenceFormValues) => void;
  nextNumber?: string | number;
  numberPrefix?: string;
  autoIncrement?: string;
}

function WarehouseTransferNumberDialogContentInner({
  initialValues,
  onConfirm,
  nextNumber,
  numberPrefix,
  autoIncrement,
  closeDialog,
}: WarehouseTransferNumberDialogContentProps): React.ReactElement {
  const { mutateAsync: saveSettings } = useSaveSettings();
  const [referenceFormValues, setReferenceFormValues] =
    React.useState<ReferenceFormValues | null>(null);

  const handleSubmitForm = (
    values: ReferenceFormValues,
    { setSubmitting }: FormikHelpers<ReferenceFormValues>,
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

  const handleChange = (values: ReferenceFormValues) => {
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
export const WarehouseTransferNumberDialogContent = compose(
  withDialogActions,
  withSettingsActions,
  withSettings(({ warehouseTransferSettings }: Record<string, any>) => ({
    autoIncrement: warehouseTransferSettings?.autoIncrement,
    nextNumber: warehouseTransferSettings?.nextNumber,
    numberPrefix: warehouseTransferSettings?.numberPrefix,
  })),
)(WarehouseTransferNumberDialogContentInner);
