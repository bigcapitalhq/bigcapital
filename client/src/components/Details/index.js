import React from 'react';
import className from 'classname';

/**
 * Details menu.
 */
export function DetailsMenu({ children, vertical = false }) {
  return (
    <div
      className={className('details-menu', {
        'is-vertical': vertical,
      })}
    >
      {children}
    </div>
  );
}

/**
 * Detail item.
 */
export function DetailItem({ label, children }) {
  return (
    <div class="detail-item">
      <div class="detail-item__label">{label}</div>
      <div class="detail-item__content">{children}</div>
    </div>
  );
}
