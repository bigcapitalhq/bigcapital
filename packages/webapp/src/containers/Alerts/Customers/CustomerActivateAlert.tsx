// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';

import { useActivateContact } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Customer activate alert.
 */
function CustomerActivateAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { customerId, service },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: activateContact, isLoading } = useActivateContact();

  // Handle activate customer alert cancel.
  const handleCancelActivateCustomer = () => {
    closeAlert(name);
  };

  // Handle confirm customer activated.
  const handleConfirmCustomerActivate = () => {
    activateContact(customerId)
      .then(() => {
        AppToaster.show({
          message: intl.get('customer.alert.activated_message'),
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
      onCancel={handleCancelActivateCustomer}
      loading={isLoading}
      onConfirm={handleConfirmCustomerActivate}
    >
      <p>
        {intl.get('customer.alert.are_you_sure_want_to_activate_this_customer')}
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CustomerActivateAlert);
