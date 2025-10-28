// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import {
  AppToaster,
  FormattedMessage as T,
  FormattedHTMLMessage,
} from '@/components';

import { useDeleteCashflowTransaction } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { compose } from '@/utils';
import { DRAWERS } from '@/constants/drawers';

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

  // #withDrawerActions
  closeDrawer,
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
        closeDrawer(DRAWERS.CASHFLOW_TRNASACTION_DETAILS);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          if (
            errors.find(
              (e) =>
                e.type ===
                'CANNOT_DELETE_TRANSACTION_CONVERTED_FROM_UNCATEGORIZED',
            )
          ) {
            AppToaster.show({
              message:
                'Cannot delete transaction converted from uncategorized transaction but you uncategorize it.',
              intent: Intent.DANGER,
            });
          } else if (
            errors.find((e) => e.type === 'CANNOT_DELETE_TRANSACTION_MATCHED')
          ) {
            AppToaster.show({
              message:
                'Cannot delete a transaction matched to the bank transaction',
              intent: Intent.DANGER,
            });
          }
        },
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
  withDrawerActions,
)(AccountDeleteTransactionAlert);
