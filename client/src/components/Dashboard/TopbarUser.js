import React, { useMemo, useCallback } from 'react';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {
  Menu,
  MenuItem,
  MenuDivider,
  Button,
  Popover
} from '@blueprintjs/core';
import t from 'store/types';
import { FormattedMessage as T, useIntl } from 'react-intl';

function DashboardTopbarUser({ logout }) {
  const history = useHistory();
  
  const onClickLogout = useCallback(() => {
    logout();
    history.go('/auth/login');
  }, [logout, history]);

  const userAvatarDropMenu = useMemo(() => (
    <Menu>
      <MenuItem icon="graph" text={<T id={'menu'}/>} />
      <MenuItem icon="map" text={<T id={'graph'}/>} />
      <MenuItem icon="th" text={<T id={'table'}/>} shouldDismissPopover={false} />
      <MenuItem icon="zoom-to-fit" text={<T id={'nucleus'}/>} disabled={true} />
      <MenuDivider />
      <MenuItem icon="cog" text={<T id={'logout'}/>} onClick={onClickLogout} />
    </Menu>
  ), [onClickLogout]);

  return (
    <Popover content={userAvatarDropMenu}>
      <Button>
        <div className="user-avatar"></div>
      </Button>
    </Popover>
  )
}

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch({ type: t.LOGOUT }),
});

export default connect(null, mapDispatchToProps)(DashboardTopbarUser);