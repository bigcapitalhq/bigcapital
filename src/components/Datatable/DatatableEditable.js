import React from 'react';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';
import { DataTable, If } from 'components';
import 'style/components/DataTable/DataTableEditable.scss';

/**
 * Editable datatable.
 */
export default function DatatableEditable({
  totalRow = false,
  actions,
  name,
  className,
  ...tableProps
}) {
  return (
    <div
      className={classNames(
        CLASSES.DATATABLE_EDITOR,
        {
          [`${CLASSES.DATATABLE_EDITOR}--${name}`]: name,
        },
        className,
      )}
    >
      <DataTable {...tableProps} />

      <If condition={actions}>
        <div className={classNames(CLASSES.DATATABLE_EDITOR_ACTIONS)}>
          {actions}
        </div>
      </If>
    </div>
  );
}
