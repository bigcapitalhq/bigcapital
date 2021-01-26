import React, { useContext } from 'react';
import classNames from 'classnames';
import { ContextMenu } from '@blueprintjs/core';

import TableContext from './TableContext';
import { saveInvoke } from 'utils';

/**
 * Table row.
 */
export default function TableRow({ row, className, style }) {
  const {
    props: { TableCellRenderer, rowContextMenu, rowClassNames },
  } = useContext(TableContext);

  // Handle rendering row context menu.
  const handleRowContextMenu = (row) => (e) => {
    if (typeof rowContextMenu === 'function') {
      e.preventDefault();
      const tr = e.currentTarget.closest('.tr');
      tr.classList.add('is-context-menu-active');

      const DropdownEl = rowContextMenu({ row });

      ContextMenu.show(DropdownEl, { left: e.clientX, top: e.clientY }, () => {
        tr.classList.remove('is-context-menu-active');
      });
    }
  };

  return (
    <div
      {...row.getRowProps({
        className: classNames(
          'tr',
          {
            'is-expanded': row.isExpanded && row.canExpand,
          },
          saveInvoke(rowClassNames, row),
          className,
        ),
        style,
        onContextMenu: handleRowContextMenu(row)
      })}
    >
      {row.cells.map((cell, index) => (
        <TableCellRenderer cell={cell} row={row} index={index + 1} />
      ))}
    </div>
  );
}
