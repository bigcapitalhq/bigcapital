import React from 'react';
import classNames from 'classnames';
 
export default function Card({ className, children }) {
  return <div className={classNames('card', className)}>{children}</div>;
}
