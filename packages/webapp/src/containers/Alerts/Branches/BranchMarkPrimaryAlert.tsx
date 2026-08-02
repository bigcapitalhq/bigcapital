import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import { AppToaster, FormattedMessage as T } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { useMarkBranchAsPrimary } from '@/hooks/query';
import { compose } from '@/utils';

interface BranchMarkPrimaryAlertPayload {
  branchId: number | string;
}

interface BranchMarkPrimaryAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: BranchMarkPrimaryAlertPayload;
}

/**
 * branch mark primary alert.
 */
function BranchMarkPrimaryAlertInner({
  name,
  isOpen,
  payload: { branchId },
  closeAlert,
}: BranchMarkPrimaryAlertProps): React.ReactElement {
  const { mutateAsync: markPrimaryBranchMutate, isPending: isLoading } =
    useMarkBranchAsPrimary();

  const handleCancelMarkPrimaryAlert = () => {
    closeAlert(name);
  };

  const handleConfirmMarkPrimaryBranch = () => {
    markPrimaryBranchMutate(branchId)
      .then(() => {
        AppToaster.show({
          message: intl.get('branch.alert.mark_primary_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch((error: Error) => {
        // Bugfix: original @ts-nocheck silently closed the alert on error without surfacing the failure.
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
      intent={Intent.WARNING}
      isOpen={isOpen}
      onCancel={handleCancelMarkPrimaryAlert}
      onConfirm={handleConfirmMarkPrimaryBranch}
      loading={isLoading}
    >
      <p>
        <T id={'branch.alert.are_you_sure_you_want_to_make'} />
      </p>
    </Alert>
  );
}

export const BranchMarkPrimaryAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(BranchMarkPrimaryAlertInner);
