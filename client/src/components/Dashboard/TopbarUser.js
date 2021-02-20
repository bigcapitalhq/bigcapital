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
import { FormattedMessage as T } from 'react-intl';

import { firstLettersArgs } from 'utils';
import { useAuthActions, useAuthUser } from 'hooks/state';

export default function DashboardTopbarUser() {
  const history = useHistory();
  const { setLogout } = useAuthActions();
  const user = useAuthUser();

  const onClickLogout = () => {
    setLogout();
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
