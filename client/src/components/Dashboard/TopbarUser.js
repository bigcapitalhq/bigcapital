import React from 'react';
import {connect} from 'react-redux';
import {Menu, MenuItem, MenuDivider, Button, Popover} from '@blueprintjs/core';
import t from 'store/types';

function DashboardTopbarUser({ logout }) {
  const onClickLogout = () => { logout(); };

  const userAvatarDropMenu = (
    <Menu>
      <MenuItem icon="graph" text="Graph" />
      <MenuItem icon="map" text="Map" />
      <MenuItem icon="th" text="Table" shouldDismissPopover={false} />
      <MenuItem icon="zoom-to-fit" text="Nucleus" disabled={true} />
      <MenuDivider />
      <MenuItem icon="cog" text="Logout" onClick={onClickLogout} />
    </Menu>
  );

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