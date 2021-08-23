import React from 'react';
import classNames from 'classnames';

import 'style/components/Details.scss';

/**
 * Details menu.
 */
export function DetailsMenu({ children, vertical = false }) {
  return (
    <div
      className={classNames('details-menu', {
        'is-vertical': vertical,
      })}
    >
      {children}
    </div>
  );
}

/**
 * Detail item vertical .
 */
export function DetailItem({ label, children }) {
  return (
    <div class="detail-item">
      <div class="detail-item__label">{label}</div>
      <div class="detail-item__content">{children}</div>
    </div>
  );
}
