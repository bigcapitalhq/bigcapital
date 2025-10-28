// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  MenuDivider,
  Button,
  Popover,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T } from '@/components';

import { useAuthActions } from '@/hooks/state';

import withDialogActions from '@/containers/Dialog/withDialogActions';

import { useAuthenticatedAccount } from '@/hooks/query';
import { firstLettersArgs, compose } from '@/utils';

/**
 * Dashboard topbar user.
 */
function DashboardTopbarUser({
  // #withDialogActions
  openDialog,
}) {
  const history = useHistory();
  const { setLogout } = useAuthActions();

  // Retrieve authenticated user information.
  const { data: user } = useAuthenticatedAccount();

  const onClickLogout = () => {
    setLogout();
  };

  const onKeyboardShortcut = () => {
    openDialog('keyboard-shortcuts');
  };

  return (
    <Popover
      content={
        <Menu className={'menu--logged-user-dropdown'}>
          <MenuItem
            multiline={true}
            className={'menu-item--profile'}
            text={
              <div>
                <div class="person">
                  {user.first_name} {user.last_name}
                </div>
                <div class="org">
                  <T id="organization_id" />: {user.tenant_id}
                </div>
              </div>
            }
          />
          <MenuDivider />
          <MenuItem
            text={<T id={'keyboard_shortcuts'} />}
            onClick={onKeyboardShortcut}
          />
          <MenuItem
            text={<T id={'preferences'} />}
            onClick={() => history.push('/preferences')}
          />
          <MenuItem text={<T id={'logout'} />} onClick={onClickLogout} />
        </Menu>
      }
      position={Position.BOTTOM}
    >
      <Button>
        <div className="user-text">
          {firstLettersArgs(user.first_name, user.last_name)}
        </div>
      </Button>
    </Popover>
  );
}
export default compose(withDialogActions)(DashboardTopbarUser);
