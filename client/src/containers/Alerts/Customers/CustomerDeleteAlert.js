import React, { useCallback, useState } from 'react';
import {
  FormattedMessage as T,
  FormattedHTMLMessage,
  useIntl,
} from 'react-intl';
import { Intent, Alert } from '@blueprintjs/core';
import { queryCache } from 'react-query';
import { AppToaster } from 'components';
import { transformErrors } from 'containers/Customers/utils';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';
import withCustomersActions from 'containers/Customers/withCustomersActions';

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
  // #withCustomersActions
  requestDeleteCustomer,

  // #withAlertActions
  closeAlert,
}) {
  const { formatMessage } = useIntl();
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
          message: formatMessage({
            id: 'the_customer_has_been_deleted_successfully',
          }),
          intent: Intent.SUCCESS,
        });
        queryCache.invalidateQueries('customers-table');
      })
      .catch((errors) => {
        transformErrors(errors);
      })
      .finally(() => {
        closeAlert(name);
      });
  }, [deleteCustomerMutate, customerId, closeAlert, name, formatMessage]);

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
  withCustomersActions,
)(CustomerDeleteAlert);
