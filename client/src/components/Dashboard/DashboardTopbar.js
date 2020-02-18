import React from 'react';
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

export default function DashboardTopbar({ pageTitle }) {
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
      <h1 class="dashboard__title">{ pageTitle }</h1>
      
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