import React, { useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  MenuDivider,
  Button,
  Popover,
  Position,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';

import withAuthentication from 'containers/Authentication/withAuthentication';
import withAuthenticationActions from 'containers/Authentication/withAuthenticationActions';

import { compose, firstLettersArgs } from 'utils';

function DashboardTopbarUser({ requestLogout, user }) {
  const history = useHistory();

  const onClickLogout = useCallback(() => {
    requestLogout();
  }, []);

  const userAvatarDropMenu = useMemo(
    () => (
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
          text={<T id={'preferences'} />}
          onClick={() => history.push('/preferences')}
        />
        <MenuItem text={<T id={'logout'} />} onClick={onClickLogout} />
      </Menu>
    ),
    [onClickLogout],
  );

  return (
    <Popover content={userAvatarDropMenu} position={Position.BOTTOM}>
      <Button>
        <div className="user-text">
          {firstLettersArgs(user.first_name, user.last_name)}
        </div>
      </Button>
    </Popover>
  );
}

export default compose(
  withAuthentication(({ user }) => ({ user })),
  withAuthenticationActions,
)(DashboardTopbarUser);
