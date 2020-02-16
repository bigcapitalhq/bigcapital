import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import SidebarContainer from './SidebarContainer';
import SidebarHead from './SidebarHead';
import sidebarRoutes from '../../routes/sidebar';

export default function Sidebar() {
  return (
    <SidebarContainer>
      <SidebarHead />

      <div className="sidebar__menu">
        <Menu>
          { sidebarRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              children={<route.sidebar />}
            />
          ))}
        </Menu>
      </div>
    </SidebarContainer>
  )
}