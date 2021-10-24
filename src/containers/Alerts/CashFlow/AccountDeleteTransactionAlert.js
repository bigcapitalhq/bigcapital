import React from 'react';
import intl from 'react-intl-universal';
import { FormattedMessage as T, FormattedHTMLMessage } from 'components';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster } from 'components';
import { useDeleteCashflowTransaction } from 'hooks/query';

import withAlertStoreConnect from 'containers/Alert/withAlertStoreConnect';
import withAlertActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * Account delete transaction alert.
 */
function AccountDeleteTransactionAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { referenceId },

  // #withAlertActions
  closeAlert,
}) {
  const { mutateAsync: deleteTransactionMutate, isLoading } =
    useDeleteCashflowTransaction();

  // handle cancel delete alert
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handleConfirm delete transaction.
  const handleConfirmTransactioneDelete = () => {
    deleteTransactionMutate(referenceId)
      .then(() => {
        AppToaster.show({
          message: intl.get('cash_flow_transaction.delete.alert_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {},
      )
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
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmTransactioneDelete}
      loading={isLoading}
    >
      <p>
        <FormattedHTMLMessage
          id={
            'cash_flow_transaction_once_delete_this_transaction_you_will_able_to_restore_it'
          }
        />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(AccountDeleteTransactionAlert);
