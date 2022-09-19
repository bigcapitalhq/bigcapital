// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';

import { useInactivateContact } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Vendor inactivate alert.
 */
function VendorInactivateAlert({
  name,
  // #withAlertStoreConnect
  isOpen,
  payload: { vendorId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: inactivateContact, isLoading } = useInactivateContact();

  // Handle cancel inactivate alert.
  const handleCancelInactivateVendor = () => {
    closeAlert(name);
  };

  // Handle confirm contact Inactive.
  const handleConfirmVendorInactive = () => {
    inactivateContact(vendorId)
      .then(() => {
        AppToaster.show({
          message: intl.get('vendor.alert.inactivated_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'inactivate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelInactivateVendor}
      onConfirm={handleConfirmVendorInactive}
      loading={isLoading}
    >
      <p>
        {intl.get('vendor.alert.are_you_sure_want_to_inactivate_this_vendor')}
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(VendorInactivateAlert);
