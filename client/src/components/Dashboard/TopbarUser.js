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
import { If, FormattedMessage as T } from 'components';

import { firstLettersArgs } from 'utils';
import { useAuthActions, useAuthUser } from 'hooks/state';

import withDialogActions from 'containers/Dialog/withDialogActions';
import { compose } from 'utils';
import withSubscriptions from '../../containers/Subscriptions/withSubscriptions';

function DashboardTopbarUser({
  openDialog,

  // #withSubscriptions
  isSubscriptionActive
}) {
  const history = useHistory();
  const { setLogout } = useAuthActions();
  const user = useAuthUser();

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
          <If condition={isSubscriptionActive}>
            <MenuItem
              text={<T id={'keyboard_shortcuts'} />}
              onClick={onKeyboardShortcut}
            />
            <MenuItem
              text={<T id={'preferences'} />}
              onClick={() => history.push('/preferences')}
            />
          </If>
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
export default compose(
  withDialogActions,
  withSubscriptions(
    ({ isSubscriptionActive }) => ({ isSubscriptionActive }),
    'main',
  ),
)(DashboardTopbarUser);
