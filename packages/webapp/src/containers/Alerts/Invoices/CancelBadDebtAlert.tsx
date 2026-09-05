import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useCancelBadDebt } from '@/hooks/query';
import { compose } from '@/utils';

interface CancelBadDebtAlertPayload {
  invoiceId: number;
}

interface CancelBadDebtAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: CancelBadDebtAlertPayload;
}

/**
 * Cancel bad debt alert.
 */
function CancelBadDebtAlertInner({
  name,
  isOpen,
  payload: { invoiceId },
  closeAlert,
}: CancelBadDebtAlertProps): React.ReactElement {
  const { mutateAsync: cancelBadDebtMutate, isPending: isLoading } =
    useCancelBadDebt();

  const handleCancel = () => {
    closeAlert(name);
  };

  const handleConfirm = () => {
    cancelBadDebtMutate(invoiceId)
      .then(() => {
        AppToaster.show({
          message: intl.get('bad_debt.cancel_alert.success_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck had an empty `.catch(() => {})` that silently swallowed failures.
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
      confirmButtonText={intl.get('save')}
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

export const CancelBadDebtAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(CancelBadDebtAlertInner);
