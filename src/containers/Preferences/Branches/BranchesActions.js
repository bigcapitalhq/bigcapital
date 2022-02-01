import React from 'react';
import { Button, Intent } from '@blueprintjs/core';

import { FormattedMessage as T, Icon } from 'components';
import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';

function BranchesActions({
  //#ownProps
  openDialog,
}) {
  const handleClickNewBranche = () => {
    openDialog('branch-form');
  };

  return (
    <React.Fragment>
      <Button
        icon={<Icon icon="plus" iconSize={12} />}
        onClick={handleClickNewBranche}
        intent={Intent.PRIMARY}
      >
        <T id={'branches.label.new_branch'} />
      </Button>
    </React.Fragment>
  );
}

export default compose(withDialogActions)(BranchesActions);
