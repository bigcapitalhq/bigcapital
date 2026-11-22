import { Button, Intent } from '@blueprintjs/core';
import * as FF from 'fp-ts/function';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Can, Icon, FormattedMessage as T } from '@/components';
import { AbilitySubject, UserAction } from '@/constants/abilityOption';
import {
  withDialogActions,
  type WithDialogActionsProps,
} from '@/containers/Dialog/withDialogActions';

function UsersActionsInner({ openDialog }: WithDialogActionsProps) {
  const history = useHistory();
  const onClickNewUser = () => {
    openDialog('invite-user');
  };
  const onClickNewRole = () => {
    history.push('/preferences/roles');
  };

  return (
    <div className="preferences-actions">
      <Can I={UserAction.Create} a={AbilitySubject.User}>
        <Button
          icon={<Icon icon="plus" iconSize={12} />}
          onClick={onClickNewUser}
          intent={Intent.PRIMARY}
        >
          <T id={'invite_user'} />
        </Button>
      </Can>

      <Button
        icon={<Icon icon="plus" iconSize={12} />}
        onClick={onClickNewRole}
      >
        <T id={'new_role'} />
      </Button>
    </div>
  );
}

export const UsersActions = FF.pipe(UsersActionsInner, withDialogActions);
