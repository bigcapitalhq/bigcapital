// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { Intent, Alert } from '@blueprintjs/core';
import { useCancelBadDebt } from '@/hooks/query';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { compose } from '@/utils';

/**
 * Cancel bad debt alert.
 */
function CancelBadDebtAlert({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { invoiceId },

  // #withAlertActions
  closeAlert,
}) {
  // handle cancel  alert.
  const handleCancel = () => {
    closeAlert(name);
  };

  const { mutateAsync: cancelBadDebtMutate, isLoading } = useCancelBadDebt();

  // handleConfirm alert.
  const handleConfirm = () => {
    cancelBadDebtMutate(invoiceId)
      .then(() => {
        AppToaster.show({
          message: intl.get('bad_debt.cancel_alert.success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(() => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={<T id={'cancel'} />}
      confirmButtonText={<T id={'save'} />}
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={isLoading}
    >
      <p>
        <T id={'bad_debt.cancel_alert.message'} />
      </p>
    </Alert>
  );
}

export default compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CancelBadDebtAlert);
