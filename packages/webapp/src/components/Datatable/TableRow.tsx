import classNames from 'classnames';
import React, { useContext } from 'react';
import TableContext from './TableContext';
import type { Row } from 'react-table';
import { saveInvoke } from '@/utils';

interface TableRowProps {
  row: Row<any>;
  className?: string;
  style?: React.CSSProperties;
  TableCellRenderer?: React.ComponentType<any>;
}

export default function TableRow({ row, className, style }: TableRowProps) {
  const {
    openRowMenu,
    props: {
      TableCellRenderer,
      rowClassNames,
      rowTestId,
      ContextMenu: ContextMenuContent,
    },
  } = useContext(TableContext);

  const rowTestIdValue =
    typeof rowTestId === 'function' ? saveInvoke(rowTestId, row) : rowTestId;

  const cells = row.cells.map((cell, index) => (
    <TableCellRenderer key={index} cell={cell} row={row} index={index + 1} />
  ));

  return (
    <div
      {...row.getRowProps({
        className: classNames(
          'tr',
          { 'is-expanded': row.isExpanded && row.canExpand },
          saveInvoke(rowClassNames, row),
          className,
        ),
        style,
        ...(rowTestIdValue ? { 'data-testId': rowTestIdValue } : {}),
      })}
    >
      {ContextMenuContent ? (
        <div
          className="tr-context"
          onContextMenu={(event) => {
            if (event.defaultPrevented) {
              return;
            }
            event.preventDefault();
            openRowMenu({
              row,
              offset: { left: event.clientX, top: event.clientY },
            });
          }}
        >
          {cells}
        </div>
      ) : (
        cells
      )}
    </div>
  );
}
