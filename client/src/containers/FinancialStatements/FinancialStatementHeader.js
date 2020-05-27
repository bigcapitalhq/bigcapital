import React from 'react';
import classNames from 'classnames';

export default function FinancialStatementHeader({ show, children }) {
  return (
    <div
      className={classNames('financial-statement__header', {
        'is-hidden': !show,
      })}
    >
      {children}
    </div>
  );
}
