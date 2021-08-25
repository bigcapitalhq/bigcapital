import React from 'react';
import clsx from 'classnames';

import TotalLinesCls from './TotalLines.module.scss';

export function TotalLines({ children, className }) {
  return (
    <div className={clsx('total_lines', TotalLinesCls.total_lines, className)}>
      {children}
    </div>
  );
}

export function TotalLine({ title, value, className }) {
  return (
    <div
      className={clsx('total_lines_line', TotalLinesCls.total_line, className)}
    >
      <div class="title">{title}</div>
      <div class="amount">{value}</div>
    </div>
  );
}
