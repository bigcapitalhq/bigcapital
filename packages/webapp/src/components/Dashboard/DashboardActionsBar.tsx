import { Navbar } from '@blueprintjs/core';
import clsx from 'classnames';
import React from 'react';

interface DashboardActionsBarProps {
  children?: React.ReactNode;
  className?: string;
  name?: string;
}

export function DashboardActionsBar({
  className,
  children,
  name,
}: DashboardActionsBarProps) {
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
