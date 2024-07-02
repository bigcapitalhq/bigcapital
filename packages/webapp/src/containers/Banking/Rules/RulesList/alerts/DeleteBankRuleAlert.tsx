// @ts-nocheck
import React from 'react';
import { Intent, Alert } from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';
import { AppToaster } from '@/components';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';
import withDrawerActions from '@/containers/Drawer/withDrawerActions';

import { useDeleteBankRule } from '@/hooks/query/bank-rules';
import { compose } from '@/utils';

/**
 * Project delete alert.
 */
function BankRuleDeleteAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { id },

  // #withAlertActions
  closeAlert,

  // #withDrawerActions
  closeDrawer,
}) {
  const { mutateAsync: deleteBankRule, isLoading } = useDeleteBankRule();

  // handle cancel delete project alert.
  const handleCancelDeleteAlert = () => {
    closeAlert(name);
  };

  // handleConfirm delete project
  const handleConfirmBtnClick = () => {
    deleteBankRule(id)
      .then(() => {
        AppToaster.show({
          message: 'The bank rule has deleted successfully.',
          intent: Intent.SUCCESS,
        });
        closeAlert(name);
      })
      .catch(
        ({
          response: {
            data: { errors },
          },
        }) => {
          AppToaster.show({
            message: 'Something went wrong.',
            intent: Intent.DANGER,
          });
        },
      );
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={'Delete'}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDeleteAlert}
      onConfirm={handleConfirmBtnClick}
      loading={isLoading}
    >
      <p>Are you sure want to delete the bank rule?</p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
  withDrawerActions,
)(BankRuleDeleteAlert);
