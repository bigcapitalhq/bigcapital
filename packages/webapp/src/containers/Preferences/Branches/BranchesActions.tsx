// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import { Features } from '@/constants';
import { FeatureCan, FormattedMessage as T, Icon } from '@/components';
import { withDialogActions } from '@/containers/Dialog/withDialogActions';
import { flow } from 'fp-ts/function';

function BranchesActionsInner({
  //#ownProps
  openDialog,
}) {
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

export const BranchesActions = flow(withDialogActions)(
  BranchesActionsInner,
);
