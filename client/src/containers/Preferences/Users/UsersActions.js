import React, {useCallback} from 'react';
import {
  Button,
  Intent,
} from '@blueprintjs/core';
import { FormattedMessage as T, useIntl } from 'react-intl';

import Icon from 'components/Icon';
import withDialogActions from 'containers/Dialog/withDialogActions';
import {compose} from 'utils';

function UsersActions({
  openDialog,
  closeDialog,
}) {
  const onClickNewUser = useCallback(() => {
    openDialog('user-form');
  }, [openDialog]);

  return (
    <div className="preferences-actions">
      <Button
        icon={<Icon icon='plus' iconSize={12} />}
        onClick={onClickNewUser}
        intent={Intent.PRIMARY}>
        <T id={'invite_user'} />
      </Button>

      <Button
        icon={<Icon icon='plus' iconSize={12} />}
        onClick={onClickNewUser}>
        <T id={'new_role'} />
      </Button>
    </div>
  );
}

export default compose(
  withDialogActions,
)(UsersActions);