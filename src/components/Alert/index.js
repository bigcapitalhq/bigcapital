import React from 'react';
import clsx from 'classnames';

import Style from './style.module.scss';

export function Alert({ title, description, intent }) {
  return (
    <div
      className={clsx(Style.root, {
        [`${Style['root_' + intent]}`]: intent,
      })}
    >
      {title && <h3 className={clsx(Style.title)}>{title}</h3>}
      {description && <p class={clsx(Style.description)}>{description}</p>}
    </div>
  );
}
