// @ts-nocheck
import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import {
  AppToaster,
  FormattedMessage as T,
  FormattedHTMLMessage,
} from '@/components';

import { transformErrors } from '@/containers/Vendors/utils';
import { useDeleteVendor } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

/**
 * Vendor delete alert.
 */
function VendorDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { contactId },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { mutateAsync: deleteVendorMutate, isLoading } = useDeleteVendor();

  // Handle cancel delete the vendor.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // Handle confirm delete vendor.
  const handleConfirmDeleteVendor = useCallback(() => {
    deleteVendorMutate(contactId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_vendor_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
        closeDrawer(DRAWERS.VENDOR_DETAILS);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          transformErrors(errors);
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  }, [deleteVendorMutate, name, closeAlert, contactId]);

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
  withDrawerActions,
)(VendorDeleteAlert);
