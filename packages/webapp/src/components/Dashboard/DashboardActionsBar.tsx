// @ts-nocheck
import React from 'react';
import clsx from 'classnames';
import { Navbar } from '@blueprintjs/core';

export function DashboardActionsBar({ className, children, name }) {
  return (
    <div
      className={clsx(
        {
          'dashboard__actions-bar': true,
          [`dashboard__actions-bar--${name}`]: !!name,
        },
        className,
      )}
    >
      <Navbar className="navbar--dashboard-actions-bar">{children}</Navbar>
    </div>
  );
}
