import React, { useCallback } from 'react';
import intl from 'react-intl-universal';
import {  FormattedMessage as T, FormattedHTMLMessage } from 'components';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { transformErrors } from 'containers/Customers/utils';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { useDeleteCustomer } from 'hooks/query';
import { compose } from 'utils';


/**
 * Customer delete alert.
 */
function CustomerDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { customerId },

  // #withAlertActions
  closeAlert,
}) {
  
  const {
    mutateAsync: deleteCustomerMutate,
    isLoading
  } = useDeleteCustomer();

  // handle cancel delete  alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handle confirm delete customer.
  const handleConfirmDeleteCustomer = useCallback(() => {
    deleteCustomerMutate(customerId)
      .then(() => {
        AppToaster.show({
          message: intl.get('the_customer_has_been_deleted_successfully'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(({ response: { data: { errors } } }) => {
        transformErrors(errors);
      })
      .finally(() => {
        closeAlert(name);
      });
  }, [deleteCustomerMutate, customerId, closeAlert, name]);

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'delete'} />}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmDeleteCustomer}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={'once_delete_this_customer_you_will_able_to_restore_it'}
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CustomerDeleteAlert);
