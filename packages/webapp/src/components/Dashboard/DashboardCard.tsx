import classNames from 'classnames';
import React from 'react';
import { CLASSES } from '@/constants/classes';

interface DashboardCardProps {
  children?: React.ReactNode;
  page?: boolean;
}

// Dashboard card.
export function DashboardCard({ children, page }: DashboardCardProps) {
  return (
    <div
      className={classNames(CLASSES.DASHBOARD_CARD, {
        [CLASSES.DASHBOARD_CARD_PAGE]: page,
      })}
    >
      {children}
    </div>
  );
}
