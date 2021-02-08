import React, { useContext } from 'react';
import classNames from 'classnames';
import useContextMenu from 'react-use-context-menu';

import TableContext from './TableContext';
import { saveInvoke } from 'utils';
import { ContextMenu } from 'components';


/**
 * Table row.
 */
export default function TableRow({ row, className, style }) {
  const {
    props: {
      TableCellRenderer,
      rowContextMenu,
      rowClassNames,
      ContextMenu: ContextMenuContent,
    },
    table,
  } = useContext(TableContext);

  const [
    bindMenu,
    bindMenuItem,
    useContextTrigger,
    { coords, setVisible, isVisible },
  ] = useContextMenu();

  const [bindTrigger] = useContextTrigger({
    collect: () => 'Title',
  });

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
      })}
      {...bindTrigger}
    >
      {row.cells.map((cell, index) => (
        <TableCellRenderer cell={cell} row={row} index={index + 1} />
      ))}

      <ContextMenu
        bindMenu={bindMenu}
        isOpen={isVisible}
        coords={coords}
        onClosed={() => setVisible(false)}
      >
        <ContextMenuContent {...table} row={row} />
      </ContextMenu>
    </div>
  );
}
