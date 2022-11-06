// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useActivateContact } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Vendor activate alert.
 */
function VendorActivateAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { vendorId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: activateContact, isLoading } = useActivateContact();

  // Handle activate vendor alert cancel.
  const handleCancelActivateVendor = () => {
    closeAlert(name);
  };

  // Handle confirm vendor activated.
  const handleConfirmVendorActivate = () => {
    activateContact(vendorId)
      .then(() => {
        AppToaster.show({
          message: intl.get('vendor.alert.activated_message'),
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
      confirmButtonText={<T id={'activate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelActivateVendor}
      loading={isLoading}
      onConfirm={handleConfirmVendorActivate}
    >
      <p>
        {intl.get('vendor.alert.are_you_sure_want_to_activate_this_vendor')}
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(VendorActivateAlert);
