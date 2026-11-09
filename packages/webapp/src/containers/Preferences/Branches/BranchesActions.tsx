import { Button, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import type { WithDialogActionsProps } from '@/containers/Dialog/withDialogActions';
import { FeatureCan, FormattedMessage as T, Icon } from '@/components';
import { Features } from '@/constants';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';

type BranchesActionsInnerProps = Pick<WithDialogActionsProps, 'openDialog'>;

function BranchesActionsInner({
  //#ownProps
  openDialog,
}: BranchesActionsInnerProps) {
  const handleClickNewBranche = () => {
    openDialog('branch-form');
  };

  return (
    <React.Fragment>
      <FeatureCan feature={Features.Branches}>
        <Button
          icon={<Icon icon="plus" iconSize={12} />}
          onClick={handleClickNewBranche}
          intent={Intent.PRIMARY}
        >
          <T id={'branches.label.new_branch'} />
        </Button>
      </FeatureCan>
    </React.Fragment>
  );
}

export const BranchesActions = FF.pipe(BranchesActionsInner, withDialogActions);
