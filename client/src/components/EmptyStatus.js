import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import 'style/components/DataTable/DataTableEmptyStatus.scss';

/**
 * Datatable empty status.
 */
export default function EmptyStatuts({ title, description, action, children }) {
  return (
    <div className={classNames(CLASSES.DATATABLE_EMPTY_STATUS)}>
      <h1 className={classNames(CLASSES.DATATABLE_EMPTY_STATUS_TITLE)}>
        {title}
      </h1>

      <div className={classNames(CLASSES.DATATABLE_EMPTY_STATUS_DESC)}>
        {description}
      </div>

      <div className={classNames(CLASSES.DATATABLE_EMPTY_STATUS_ACTIONS)}>
        {action}
      </div>
      {children}
    </div>
  );
}
