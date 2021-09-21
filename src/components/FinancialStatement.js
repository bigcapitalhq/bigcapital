import React from 'react';
import className from 'classnames';
import 'style/containers/FinancialStatements/FinancialSheet.scss';

export default function FinancialStatements({ name, children }) {
  return (
    <div
      className={className('financial-statement', {
        [`financial-statement--${name}`]: name,
      })}
    >
      {children}
    </div>
  );
}
