// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import {
  AppToaster,
  FormattedMessage as T,
  FormattedHTMLMessage,
} from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useDeleteCustomField } from '@/hooks/query';

import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { withAlertActions } from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Custom field delete alert.
 */
function CustomFieldDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { customFieldId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: deleteCustomField, isLoading } = useDeleteCustomField();

  // Handle cancel delete alert.
  const handleCancelDelete = () => {
    closeAlert(name);
  };

  // Handle confirm delete custom field.
  const handleConfirmDelete = () => {
    deleteCustomField(customFieldId)
      .then(() => {
        AppToaster.show({
          message: intl.get('custom_fields.delete_success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {
        AppToaster.show({
          message: intl.get('custom_fields.delete_error_message'),
          intent: Intent.DANGER,
        });
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDelete}
      onConfirm={handleConfirmDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'custom_fields.delete_confirmation'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CustomFieldDeleteAlert);
