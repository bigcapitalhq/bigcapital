import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useCancelUnlockingPartialTransactions } from '@/hooks/query';
import { compose } from '@/utils';

interface CancelUnlockingPartialAlertPayload {
  module: string;
}

interface CancelUnlockingPartialAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: CancelUnlockingPartialAlertPayload;
}

/**
 * Cancel Unlocking partial transactions alerts.
 */
function CancelUnlockingPartialTarnsactions({
  name,
  isOpen,
  payload: { module },
  closeAlert,
}: CancelUnlockingPartialAlertProps): React.ReactElement {
  const { mutateAsync: cancelUnlockingPartial, isPending: isLoading } =
    useCancelUnlockingPartialTransactions();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirm = () => {
    cancelUnlockingPartial({ module })
      .then(() => {
        AppToaster.show({
          message: intl.get(
            'unlocking_partial_transactions.alert.cancel_message',
          ),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch(({ data: { errors } }) => {})` that silently swallowed failures.
        AppToaster.show({
          message: error.message,
          intent: Intent.DANGER,
        });
      })
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('yes')}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={isLoading}
    >
      <p>
        <T id={'unlocking_partial_transactions.alert.message'} />
      </p>
    </Alert>
  );
}

export const cancelUnlockingPartialAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CancelUnlockingPartialTarnsactions);
