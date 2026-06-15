// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, EmptyStatus } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { flow } from 'fp-ts/function';

function BranchesEmptyStatusInner({
  // #withDialogActions
  openDialog,
}) {
  // Handle activate action branch.
  const handleActivateBranch = () => {
    openDialog('branch-activate', {});
  };

  return (
    <EmptyStatus
      title={<T id={'branches.empty_status.title'} />}
      description={
        <p>
          <T id={'branches.empty_status.description'} />
        </p>
      }
      action={
        <React.Fragment>
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={handleActivateBranch}
          >
            <T id={'branches.activate_button'} />
          </Button>
        </React.Fragment>
      }
    />
  );
}
export const BranchesEmptyStatus = flow(withDialogActions)(
  BranchesEmptyStatusInner,
);
