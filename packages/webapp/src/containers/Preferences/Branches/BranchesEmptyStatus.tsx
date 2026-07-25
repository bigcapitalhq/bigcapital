import { Button, Intent } from '@blueprintjs/core';
import React from 'react';
import { FormattedMessage as T, EmptyStatus } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

type BranchesEmptyStatusInnerProps = Pick<WithDialogActionsProps, 'openDialog'>;

function BranchesEmptyStatusInner({
  // #withDialogActions
  openDialog,
}: BranchesEmptyStatusInnerProps) {
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
export const BranchesEmptyStatus = compose(withDialogActions)(
  BranchesEmptyStatusInner,
);
