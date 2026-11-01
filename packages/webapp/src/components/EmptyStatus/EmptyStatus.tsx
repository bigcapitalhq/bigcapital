import clsx from 'classnames';
import React from 'react';
import Style from '@/style/components/DataTable/DataTableEmptyStatus.module.scss';

interface EmptyStatusProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  classNames?: {
    root?: string;
    title?: string;
    description?: string;
    actions?: string;
  };
}

/**
 * Datatable empty status.
 */
export function EmptyStatus({
  title,
  description,
  action,
  children,
  classNames,
}: EmptyStatusProps) {
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
