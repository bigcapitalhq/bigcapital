import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { DataTable, If } from 'components';
import 'style/components/DataTable/DataTableEditable.scss';

export default function DatatableEditable({
  totalRow = false,
  actions,
  className,
  ...tableProps
}) {
  return (
    <div className={classNames(CLASSES.DATATABLE_EDITOR, className)}>
      <DataTable {...tableProps} />

      <If condition={actions}>
        <div className={classNames(CLASSES.DATATABLE_EDITOR_ACTIONS)}>
          {actions}
        </div>
      </If>
    </div>
  );
}
