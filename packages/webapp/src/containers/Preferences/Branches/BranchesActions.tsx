// @ts-nocheck
import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import { Features } from '@/constants';
import { FeatureCan, FormattedMessage as T, Icon } from '@/components';
import withDialogActions from '@/containers/Dialog/withDialogActions';
import { compose } from '@/utils';

function BranchesActions({
  //#ownProps
  openDialog,
}) {
  const handleClickNewBranch = () => {
    openDialog('branch-form');
  };

  return (
    <React.Fragment>
      <FeatureCan feature={Features.Branches}>
        <Button
          icon={<Icon icon="plus" iconSize={12} />}
          onClick={handleClickNewBranch}
          intent={Intent.PRIMARY}
        >
          <T id={'branches.label.new_branch'} />
        </Button>
      </FeatureCan>
    </React.Fragment>
  );
}

export default compose(withDialogActions)(BranchesActions);
