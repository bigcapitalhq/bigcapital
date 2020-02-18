import React from 'react';
import {connect} from 'react-redux';
import {
  Navbar,
  NavbarGroup,
  Button,
  Classes,
  MenuDivider,
  MenuItem,
  Menu,
  Popover,
} from '@blueprintjs/core';

function DashboardTopbar({ pageTitle }) {
  const userAvatarDropMenu = (
    <Menu>
      <MenuItem icon="graph" text="Graph" />
      <MenuItem icon="map" text="Map" />
      <MenuItem icon="th" text="Table" shouldDismissPopover={false} />
      <MenuItem icon="zoom-to-fit" text="Nucleus" disabled={true} />
      <MenuDivider />
      <MenuItem icon="cog" text="Logout" />
    </Menu>
  );
  return (
    <div class="dashboard__topbar">
      <div>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" role="img" focusable="false">
            <title>Menu</title>
            <path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M4 7h22M4 15h22M4 23h22"></path>
          </svg>
        </Button>
        <h1 class="dashboard__title">{ pageTitle }</h1>
      </div>

      <div class="dashboard__topbar-actions">
        <Navbar class="dashboard__topbar-navbar">
          <NavbarGroup>
            <Button className={Classes.MINIMAL} icon="home" text="Home" />
            <Button className={Classes.MINIMAL} icon="document" text="Files" />
          </NavbarGroup>
        </Navbar>

        <div class="dashboard__user">
          <Popover content={userAvatarDropMenu}>
            <Button>
              <div className="user-avatar"></div>
            </Button>
          </Popover>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  pageTitle: state.dashboard.pageTitle,
});
export default connect(mapStateToProps)(DashboardTopbar);