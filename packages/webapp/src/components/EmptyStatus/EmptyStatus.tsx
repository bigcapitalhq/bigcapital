// @ts-nocheck
import React from 'react';
import clsx from 'classnames';

import Style from '@/style/components/DataTable/DataTableEmptyStatus.module.scss';

/**
 * Datatable empty status.
 */
export function EmptyStatus({
  title,
  description,
  action,
  children,
  classNames,
}) {
  return (
    <div className={clsx(Style.root, classNames?.root)}>
      <h1 className={clsx(Style.root_title, classNames?.title)}>{title}</h1>
      <div className={clsx(Style.root_desc, classNames?.description)}>
        {description}
      </div>
      <div className={clsx(Style.root_actions, classNames?.actions)}>
        {action}
      </div>
      {children}
    </div>
  );
}
