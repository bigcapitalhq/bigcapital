import { Alert, Intent } from '@blueprintjs/core';
import React from 'react';
import intl from 'react-intl-universal';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import { AppToaster, FormattedHTMLMessage } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { handleDeleteErrors } from '@/containers/Preferences/Branches/utils';
import { useDeleteBranch } from '@/hooks/query';
import { compose } from '@/utils';

interface BranchDeleteAlertPayload {
  branchId: number | string;
}

interface BranchDeleteAlertProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  payload: BranchDeleteAlertPayload;
}

/**
 * Branch delete alert.
 */
function BranchDeleteAlertInner({
  name,
  isOpen,
  payload: { branchId },
  closeAlert,
}: BranchDeleteAlertProps): React.ReactElement {
  const { mutateAsync: deleteBranch, isPending: isLoading } = useDeleteBranch();

  const handleCancelDelete = () => {
    closeAlert(name);
  };

  const handleConfirmDeleteBranch = () => {
    deleteBranch(branchId)
      .then(() => {
        AppToaster.show({
          message: intl.get('branch.alert.delete_message'),
          intent: Intent.SUCCESS,
        });
      })
      .catch(
        ({ data: { errors } }: { data: { errors: { type: string }[] } }) => {
          handleDeleteErrors(errors);
        },
      )
      .finally(() => {
        closeAlert(name);
      });
  };

  return (
    <Alert
      cancelButtonText={intl.get('cancel')}
      confirmButtonText={intl.get('delete')}
      icon="trash"
      intent={Intent.DANGER}
      isOpen={isOpen}
      onCancel={handleCancelDelete}
      onConfirm={handleConfirmDeleteBranch}
      loading={isLoading}
    >
      <p data-testId={'branch-delete-alert'}>
        {/* @ts-expect-error — react-intl-universal FormattedHTMLMessage JSX type mismatch (library-level issue, see Alerts/Items/ItemDeleteAlert.tsx) */}
        <FormattedHTMLMessage id={'branch.once_delete_this_branch'} />
      </p>
    </Alert>
  );
}

export const BranchDeleteAlert = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(BranchDeleteAlertInner);
