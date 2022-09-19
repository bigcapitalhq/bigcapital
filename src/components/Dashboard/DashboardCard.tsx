// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

import { CLASSES } from '@/constants/classes';

// Dashboard card.
export function DashboardCard({ children, page }) {
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
