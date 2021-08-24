import React from 'react';
import classNames from 'classnames';

import 'style/components/Details.scss';

const DIRECTION = {
  VERTICAL: 'vertical',
  HORIZANTAL: 'horizantal',
};

/**
 * Details menu.
 */
export function DetailsMenu({ children, direction = DIRECTION.VERTICAL }) {
  return (
    <div
      className={classNames('details-menu', {
        'details-menu--vertical': direction === DIRECTION.VERTICAL,
        'details-menu--horizantal': direction === DIRECTION.HORIZANTAL,
      })}
    >
      {children}
    </div>
  );
}

/**
 * Detail item.
 */
export function DetailItem({ label, children, name }) {
  return (
    <div className={classNames('detail-item', {
      [`detail-item--${name}`]: name,
    })}>
      <div class="detail-item__label">{label}</div>
      <div class="detail-item__content">{children}</div>
    </div>
  );
}
