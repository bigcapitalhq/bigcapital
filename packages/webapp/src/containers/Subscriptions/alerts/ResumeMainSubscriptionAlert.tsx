import { Intent, Alert } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useResumeMainSubscription } from '@/hooks/query/subscription';

/** Error shape rejected by the SDK fetcher on failed requests. */
interface SubscriptionAlertError {
  data: { errors: Array<{ type: string }> };
}

interface ResumeMainSubscriptionAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: { module?: string };
}

/**
 * Resume Unlocking partial transactions alerts.
 */
function ResumeMainSubscriptionAlertInner({
  name,

  // #withAlertStoreConnect
  isOpen,
  payload: { module },

  // #withAlertActions
  closeAlert,
}: ResumeMainSubscriptionAlertProps): React.ReactElement {
  const { mutateAsync: resumeSubscription, isPending: isLoading } =
    useResumeMainSubscription();

  // Handle cancel.
  const handleCancel = () => {
    closeAlert(name);
  };
  // Handle confirm.
  const handleConfirm = () => {
    const values = {
      module: module,
    };
    resumeSubscription()
      .then(() => {
        AppToaster.show({
          message: 'The subscription has been resumed.',
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
      confirmButtonText={'Resume Subscription'}
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancel}
      onConfirm={handleConfirm}
      loading={isLoading}
    >
      <p>
        <strong>The subscription for this organization will resume.</strong>

        <p>
          Are you sure want to resume the subscription of this organization?
        </p>
      </p>
    </Alert>
  );
}

export const ResumeMainSubscriptionAlert = FF.pipe(
  ResumeMainSubscriptionAlertInner,
  withAlertActions,
  withAlertStoreConnect(),
);
