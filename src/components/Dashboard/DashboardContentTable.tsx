// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { CLASSES } from '@/constants/classes';

/**
 * Dashboard content table.
 */
export function DashboardContentTable({ children }) {
  return (
    <div className={classNames(CLASSES.DASHBOARD_DATATABLE)}>{children}</div>
  );
}
