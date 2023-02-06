// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { Intent, Alert } from '@blueprintjs/core';
import { AppToaster, FormattedMessage as T } from '@/components';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { useActivateAccount } from '@/hooks/query';
import { compose } from '@/utils';

/**
 * Account activate alert.
 */
function AccountActivateAlert({
  name,
  isOpen,
  payload: { accountId },

  // #withAlertActions
  closeAlert,
}) {
  
  const {
    mutateAsync: activateAccount,
    isLoading 
  } = useActivateAccount();

  // Handle alert cancel.
  const handleCancel = () => {
    closeAlert('account-activate');
  };

  // Handle activate account confirm.
  const handleConfirmAccountActivate = () => {
    activateAccount(accountId).then(() => {
      AppToaster.show({
        message: intl.get('the_account_has_been_successfully_activated'),
        intent: Intent.SUCCESS,
      });
      closeAlert('account-activate');
    }).finally(() => {
      closeAlert('account-activate');
    });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'activate'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirmAccountActivate}
      loading={isLoading}
    >
      <p>
        <T id={'are_sure_to_activate_this_account'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(AccountActivateAlert);
