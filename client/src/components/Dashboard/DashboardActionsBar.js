import React from 'react';
import classnames from 'classnames';
import { Navbar } from "@blueprintjs/core";

export default function DashboardActionsBar({
  children, name
}) {
  return (
    <div className={classnames({
      'dashboard__actions-bar': true,
      [`dashboard__actions-bar--${name}`]: !!name,
    })}>
      <Navbar className="navbar--dashboard-actions-bar">
        { children }
      </Navbar>
    </div>
  );
}