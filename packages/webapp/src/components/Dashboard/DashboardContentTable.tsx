import classNames from 'classnames';
import React from 'react';
import { CLASSES } from '@/constants/classes';

interface DashboardContentTableProps {
  children?: React.ReactNode;
}

/**
 * Dashboard content table.
 */
export function DashboardContentTable({
  children,
}: DashboardContentTableProps) {
  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>{children}</div>
  );
}
