import { Intent, Alert } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useCancelMainSubscription } from '@/hooks/query/subscription';

/** Error shape rejected by the SDK fetcher on failed requests. */
interface SubscriptionAlertError {
  data: { errors: Array<{ type: string }> };
}

interface CancelMainSubscriptionAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { module?: string };
}

/**
 * Cancel Unlocking partial transactions alerts.
 */
function CancelMainSubscriptionAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,

  // #withAlertActions
  closeAlert,
}: CancelMainSubscriptionAlertProps): React.ReactElement {
  const { mutateAsync: cancelSubscription, isPending: isLoading } =
    useCancelMainSubscription();

  // Handle cancel.
  const handleCancel = () => {
    closeAlert(name);
  };
  // Handle confirm.
  const handleConfirm = () => {
    cancelSubscription()
      .then(() => {
        AppToaster.show({
          message: 'The subscription has been canceled.',
          intent: Intent.SUCCESS,
        });
      })
      .catch(({ data: { errors } }: SubscriptionAlertError) => {})
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={'Cancel Subscription'}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={isLoading}
    >
      <p>
        <strong>
          The subscription for this organization will end at the current billing
          period.
        </strong>
      </p>

      <p>
        You can resume the subscription at any time before it expires. Once it
        ends, write access to the organization will be blocked until you
        subscribe again.
      </p>
    </Alert>
  );
}

export const CancelMainSubscriptionAlert = FF.pipe(
  CancelMainSubscriptionAlertInner,
  withAlertActions,
  withAlertStoreConnect(),
);
