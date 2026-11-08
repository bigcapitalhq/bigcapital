import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { CustomField } from '@bigcapital/sdk-ts';
import { AppToaster } from '@/components';
import { useDeleteCustomField } from '@/hooks/query';

interface CustomFieldsDeleteAlertProps {
  field: CustomField | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CustomFieldsDeleteAlert({
  field,
  isOpen,
  onClose,
}: CustomFieldsDeleteAlertProps) {
  const { mutateAsync: deleteCustomField, isPending: isLoading } =
    useDeleteCustomField();
  const valuesCount = Number(field?.valuesCount ?? 0);
  const force = valuesCount > 0;

  const handleConfirm = () => {
    if (!field) return;

    deleteCustomField({ id: field.id, query: { force: String(force) } })
      .then(() => {
        AppToaster.show({
          message: intl.get('custom_fields.message.deleted'),
          intent: Intent.SUCCESS,
        });
        onClose();
      })
      .catch(() => {
        AppToaster.show({
          message: intl.get('something_went_wrong'),
          intent: Intent.DANGER,
        });
      });
  };

  return (
    <Alert
      isOpen={isOpen}
      onCancel={onClose}
      onConfirm={handleConfirm}
      loading={isLoading}
      intent={Intent.DANGER}
      icon={'trash'}
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={
        force
          ? intl.get('custom_fields.delete.force_confirm')
          : intl.get('delete')
      }
    >
      <p>{intl.get('custom_fields.delete.message')}</p>
      {force ? (
        <p>
          {intl.get('custom_fields.delete.force_message', {
            count: valuesCount,
          })}
        </p>
      ) : null}
    </Alert>
  );
}
