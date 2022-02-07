import React from 'react';
import styled from 'styled-components';
import { Button, Intent } from '@blueprintjs/core';
import { FormattedMessage as T, EmptyStatus } from '../../../components';
import withDialogActions from 'containers/Dialog/withDialogActions';

import { compose } from 'utils';

function BranchesEmptyStatus({
  // #withDialogActions
  openDialog,
}) {
  // Handle activate action branch.
  const handleActivateBranch = () => {
    openDialog('branch-activate', {});
  };

  return (
    <EmptyStatus
      title={'Id enim irure laborum laboris do'}
      description={
        'Commodo fugiat officia commodo proident officia excepteur proident anim. Eu sunt enim aute exercitation est. Dolore occaecat tempor elit commodo duis ipsum amet est quis. Est commodo laborum in nisi deserunt dolor ipsum.'
      }
      action={
        <React.Fragment>
          <Button
            intent={Intent.PRIMARY}
            large={true}
            onClick={handleActivateBranch}
          >
            <T id={'activate'} />
          </Button>

          <Button intent={Intent.NONE} large={true}>
            <T id={'learn_more'} />
          </Button>
        </React.Fragment>
      }
    />
  );
}
export default compose(withDialogActions)(BranchesEmptyStatus);
