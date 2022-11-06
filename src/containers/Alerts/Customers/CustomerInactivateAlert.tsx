// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';

import { useInactivateContact } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * customer inactivate alert.
 */
function CustomerInactivateAlert({
  name,
  // #withAlertStoreConnect
  isOpen,
  payload: { customerId, service },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: inactivateContact, isLoading } = useInactivateContact();

  // Handle cancel inactivate alert.
  const handleCancelInactivateCustomer = () => {
    closeAlert(name);
  };

  // Handle confirm contact Inactive.
  const handleConfirmCustomerInactive = () => {
    inactivateContact(customerId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_contact_has_been_inactivated_successfully'),
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
      onCancel={handleCancelInactivateCustomer}
      onConfirm={handleConfirmCustomerInactive}
      loading={isLoading}
    >
      <p>
        {intl.get(
          'customer.alert.are_you_sure_want_to_inactivate_this_customer',
        )}
      </p>
    </Alert>
  );
}
export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CustomerInactivateAlert);
