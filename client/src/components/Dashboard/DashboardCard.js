import React from 'react';
import classNames from 'classnames';

import { CLASSES } from 'common/classes';

// Dashboard card.
export default function DashboardCard({ children, page }) {
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
