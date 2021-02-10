import React, { useCallback } from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { transformErrors } from 'containers/Customers/utils';
import { useDeleteVendor } from 'hooks/query';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Vendor delete alert.
 */
function VendorDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { vendorId },

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
  const {
    mutateAsync: deleteVendorMutate,
    isLoading
  } = useDeleteVendor();

  // Handle cancel delete the vendor.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm delete vendor.
  const handleConfirmDeleteVendor = useCallback(() => {
    deleteVendorMutate(vendorId)
      .then(() => {
        AppToaster.show({
          message: formatMessage({
            id: 'the_vendor_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
      })
      .catch((errors) => {
        transformErrors(errors);
      })
      .finally(() => {
        closeAlert(name);
      });
  }, [deleteVendorMutate, name, closeAlert, vendorId, formatMessage]);

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmDeleteVendor}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_vendor_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(VendorDeleteAlert);
